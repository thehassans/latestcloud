const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const slugify = require('slugify');
const db = require('../database/connection');
const { authenticate, requireRole } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireRole('admin'));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [users, orders, revenue, tickets, services] = await Promise.all([
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new FROM users WHERE role = "user"'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new FROM orders'),
      db.query('SELECT COALESCE(SUM(total), 0) as total, COALESCE(SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total ELSE 0 END), 0) as monthly FROM orders WHERE payment_status = "paid"'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status IN ("open", "customer-reply") THEN 1 ELSE 0 END) as open FROM tickets'),
      db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM services')
    ]);

    // Recent orders
    const recentOrders = await db.query(`
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 10
    `);

    // Recent tickets
    const recentTickets = await db.query(`
      SELECT t.*, u.email, u.first_name, u.last_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC LIMIT 10
    `);

    // Revenue chart data (last 12 months)
    const revenueChart = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as revenue
      FROM orders WHERE payment_status = 'paid'
      AND created_at > DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    res.json({
      stats: {
        users: { total: Number(users[0].total), new: Number(users[0].new) },
        orders: { total: Number(orders[0].total), new: Number(orders[0].new) },
        revenue: { total: parseFloat(revenue[0].total), monthly: parseFloat(revenue[0].monthly) },
        tickets: { total: Number(tickets[0].total), open: Number(tickets[0].open) },
        services: { total: Number(services[0].total), active: Number(services[0].active) }
      },
      recentOrders,
      recentTickets,
      revenueChart
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const { search, status, role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, uuid, email, first_name, last_name, phone, company, role, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.get('/users/:uuid', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    delete user.password;

    const [orders, services, tickets, invoices] = await Promise.all([
      db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id]),
      db.query('SELECT * FROM services WHERE user_id = ? ORDER BY created_at DESC', [user.id]),
      db.query('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id]),
      db.query('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id])
    ]);

    res.json({ user, orders, services, tickets, invoices });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to load user' });
  }
});

router.put('/users/:uuid', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, company, role, status } = req.body;
    
    await db.query(`
      UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, company = ?, role = ?, status = ?
      WHERE uuid = ?
    `, [first_name, last_name, email, phone, company, role, status, req.params.uuid]);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Login as user (admin impersonation)
router.post('/users/:uuid/login-as', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users WHERE uuid = ?', [req.params.uuid]);
    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot impersonate admin users' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, uuid: user.uuid, email: user.email, role: user.role, impersonated: true },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error('Login as user error:', error);
    res.status(500).json({ error: 'Failed to login as user' });
  }
});

// Invoices management
router.get('/invoices', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT i.*, u.email, u.first_name, u.last_name, p.title as proposal_title
      FROM invoices i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN proposals p ON i.proposal_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }

    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const invoices = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM invoices');

    res.json({
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to load invoices' });
  }
});

router.get('/invoices/:uuid', async (req, res) => {
  try {
    const invoices = await db.query(`
      SELECT i.*, u.email, u.first_name, u.last_name, u.phone, u.company, u.address,
             p.title as proposal_title, p.items as proposal_items
      FROM invoices i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN proposals p ON i.proposal_id = p.id
      WHERE i.uuid = ?
    `, [req.params.uuid]);
    
    if (!invoices.length) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = invoices[0];
    if (invoice.proposal_items) {
      try {
        invoice.items = JSON.parse(invoice.proposal_items);
      } catch (e) {
        invoice.items = [];
      }
    }

    res.json({ invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to load invoice' });
  }
});

router.put('/invoices/:uuid/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'unpaid', 'paid', 'cancelled', 'refunded'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const paidDate = status === 'paid' ? 'NOW()' : 'NULL';
    await db.query(`
      UPDATE invoices SET status = ?, paid_date = ${status === 'paid' ? 'NOW()' : 'paid_date'}
      WHERE uuid = ?
    `, [status, req.params.uuid]);

    res.json({ message: 'Invoice status updated' });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
});

// Products management
router.get('/products', async (req, res) => {
  try {
    const products = await db.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      ORDER BY p.category_id, p.sort_order
    `);

    res.json({
      products: products.map(p => {
        let features = [];
        let specifications = {};
        try { features = p.features ? JSON.parse(p.features) : []; } catch(e) { features = []; }
        try { specifications = p.specifications ? JSON.parse(p.specifications) : {}; } catch(e) { specifications = {}; }
        return { ...p, features, specifications };
      })
    });
  } catch (error) {
    console.error('Get products error:', error.message);
    res.status(500).json({ error: 'Failed to load products', details: error.message });
  }
});

router.post('/products', [
  body('name').trim().notEmpty(),
  body('category_id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category_id, description, features, specifications, price_monthly, price_annually, setup_fee, is_featured, is_active } = req.body;
    const uuid = uuidv4();
    const slug = slugify(name, { lower: true, strict: true });

    await db.query(`
      INSERT INTO products (uuid, category_id, name, slug, description, features, specifications, price_monthly, price_annually, setup_fee, is_featured, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuid, category_id, name, slug, description, JSON.stringify(features || []), JSON.stringify(specifications || {}), price_monthly || 0, price_annually || 0, setup_fee || 0, is_featured || false, is_active !== false]);

    res.status(201).json({ message: 'Product created successfully', uuid });
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

router.put('/products/:uuid', async (req, res) => {
  try {
    const { name, category_id, description, features, specifications, price_monthly, price_annually, setup_fee, is_featured, is_active, sort_order } = req.body;
    
    await db.query(`
      UPDATE products SET name = ?, category_id = ?, description = ?, features = ?, specifications = ?, price_monthly = ?, price_annually = ?, setup_fee = ?, is_featured = ?, is_active = ?, sort_order = ?
      WHERE uuid = ?
    `, [name, category_id, description, JSON.stringify(features || []), JSON.stringify(specifications || {}), price_monthly || 0, price_annually || 0, setup_fee || 0, is_featured, is_active, sort_order || 0, req.params.uuid]);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

router.delete('/products/:uuid', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE uuid = ?', [req.params.uuid]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories management
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM product_categories ORDER BY sort_order');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description, icon, is_active } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    await db.query(`
      INSERT INTO product_categories (name, slug, description, icon, is_active)
      VALUES (?, ?, ?, ?, ?)
    `, [name, slug, description, icon, is_active !== false]);

    res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM orders');

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

router.put('/orders/:uuid/status', async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    
    // Get order and user info before update
    const orders = await db.query(`
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.uuid = ?
    `, [req.params.uuid]);
    
    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    const oldPaymentStatus = order.payment_status;
    const oldStatus = order.status;
    
    await db.query(`
      UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status)
      WHERE uuid = ?
    `, [status, payment_status, req.params.uuid]);

    // Send email notifications based on status change
    const user = { email: order.email, first_name: order.first_name, last_name: order.last_name, id: order.user_id };
    const orderData = { uuid: order.uuid, id: order.id, total: order.total };
    
    // Payment confirmed
    if (payment_status === 'paid' && oldPaymentStatus !== 'paid') {
      emailService.sendOrderConfirmed(orderData, user).catch(err => 
        console.error('Failed to send order confirmed email:', err)
      );
    }
    
    // Order completed/active - CREATE SERVICES for the user
    const newStatus = status || order.status;
    const newPaymentStatus = payment_status || order.payment_status;
    
    if (newStatus === 'active' && newPaymentStatus === 'paid') {
      // Check if services already created for this order
      const existingServices = await db.query('SELECT id FROM services WHERE order_item_id IN (SELECT id FROM order_items WHERE order_id = ?)', [order.id]);
      const existingFiltered = Array.isArray(existingServices) ? existingServices.filter(s => s.id) : [];
      
      if (existingFiltered.length === 0) {
        // Get order items and create services
        const orderItems = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        const itemsFiltered = Array.isArray(orderItems) ? orderItems.filter(i => i.id) : [];
        
        for (const item of itemsFiltered) {
          const serviceUuid = require('uuid').v4();
          const serviceType = item.product_type || 'hosting';
          
          // Calculate next due date based on billing cycle
          const now = new Date();
          let nextDueDate = new Date(now);
          if (item.billing_cycle === 'monthly') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (item.billing_cycle === 'quarterly') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 3);
          } else if (item.billing_cycle === 'semiannual') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 6);
          } else if (item.billing_cycle === 'annual' || item.billing_cycle === 'yearly') {
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          } else if (item.billing_cycle === 'biennial') {
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 2);
          } else if (item.billing_cycle === 'triennial') {
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 3);
          } else {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Default monthly
          }
          
          await db.query(`
            INSERT INTO services (uuid, user_id, order_item_id, product_id, service_type, name, domain_name, status, billing_cycle, amount, next_due_date, registration_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)
          `, [
            serviceUuid,
            order.user_id,
            item.id,
            item.product_id,
            serviceType,
            item.product_name,
            item.domain_name,
            item.billing_cycle,
            item.total_price,
            nextDueDate,
            now
          ]);
        }
        console.log(`Created ${itemsFiltered.length} services for order ${order.order_number}`);
      }
      
      // Send completion email
      if (oldStatus !== 'active') {
        emailService.sendOrderCompleted(orderData, user).catch(err => 
          console.error('Failed to send order completed email:', err)
        );
      }
    }
    
    // Order cancelled
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      emailService.sendOrderCancelled(orderData, user).catch(err => 
        console.error('Failed to send order cancelled email:', err)
      );
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Tickets management
router.get('/tickets', async (req, res) => {
  try {
    const { status, department, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT t.*, u.email, u.first_name, u.last_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND t.department = ?';
      params.push(department);
    }

    query += ' ORDER BY t.updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const tickets = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM tickets');

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to load tickets' });
  }
});

router.post('/tickets/:uuid/reply', [
  body('message').trim().notEmpty()
], async (req, res) => {
  try {
    const { message } = req.body;
    
    const tickets = await db.query(`
      SELECT t.*, u.email, u.first_name, u.last_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      WHERE t.uuid = ?
    `, [req.params.uuid]);
    if (!tickets.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const ticket = tickets[0];

    await db.query(`
      INSERT INTO ticket_replies (ticket_id, user_id, message, is_staff_reply)
      VALUES (?, ?, ?, TRUE)
    `, [ticket.id, req.user.id, message]);

    await db.query(`
      UPDATE tickets SET status = 'answered', updated_at = NOW()
      WHERE id = ?
    `, [ticket.id]);

    // Send email notification to customer
    const user = { email: ticket.email, first_name: ticket.first_name, last_name: ticket.last_name };
    const ticketData = { id: ticket.id, subject: ticket.subject };
    const reply = { message };
    
    emailService.sendTicketReplied(ticketData, user, reply, 'Support Team').catch(err => 
      console.error('Failed to send ticket reply email:', err)
    );

    res.json({ message: 'Reply added successfully' });
  } catch (error) {
    console.error('Reply ticket error:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Domain TLDs management
router.get('/tlds', async (req, res) => {
  try {
    const tlds = await db.query('SELECT * FROM domain_tlds ORDER BY tld');
    res.json({ tlds });
  } catch (error) {
    console.error('Get TLDs error:', error);
    res.status(500).json({ error: 'Failed to load TLDs' });
  }
});

router.post('/tlds', async (req, res) => {
  try {
    const { tld, price_register, price_renew, price_transfer, is_popular, is_active } = req.body;
    
    await db.query(`
      INSERT INTO domain_tlds (tld, price_register, price_renew, price_transfer, is_popular, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [tld, price_register, price_renew, price_transfer, is_popular || false, is_active !== false]);

    res.status(201).json({ message: 'TLD created successfully' });
  } catch (error) {
    console.error('Create TLD error:', error);
    res.status(500).json({ error: 'Failed to create TLD' });
  }
});

router.put('/tlds/:id', async (req, res) => {
  try {
    const { price_register, price_renew, price_transfer, is_popular, is_active, promo_price } = req.body;
    
    await db.query(`
      UPDATE domain_tlds SET price_register = ?, price_renew = ?, price_transfer = ?, is_popular = ?, is_active = ?, promo_price = ?
      WHERE id = ?
    `, [price_register, price_renew, price_transfer, is_popular, is_active, promo_price, req.params.id]);

    res.json({ message: 'TLD updated successfully' });
  } catch (error) {
    console.error('Update TLD error:', error);
    res.status(500).json({ error: 'Failed to update TLD' });
  }
});

// Coupons management
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to load coupons' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, type, value, min_order_amount, max_discount, usage_limit, expires_at, is_active } = req.body;
    
    await db.query(`
      INSERT INTO coupons (code, type, value, min_order_amount, max_discount, usage_limit, expires_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [code.toUpperCase(), type, value, min_order_amount, max_discount, usage_limit, expires_at, is_active !== false]);

    res.status(201).json({ message: 'Coupon created successfully' });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Datacenters management
router.get('/datacenters', async (req, res) => {
  try {
    const datacenters = await db.query('SELECT * FROM datacenters ORDER BY name');
    res.json({ datacenters });
  } catch (error) {
    console.error('Get datacenters error:', error);
    res.status(500).json({ error: 'Failed to load datacenters' });
  }
});

router.post('/datacenters', async (req, res) => {
  try {
    const { name, location, country, country_code, latitude, longitude, description, features, is_active } = req.body;
    
    await db.query(`
      INSERT INTO datacenters (name, location, country, country_code, latitude, longitude, description, features, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, location, country, country_code, latitude, longitude, description, JSON.stringify(features || []), is_active !== false]);

    res.status(201).json({ message: 'Datacenter created successfully' });
  } catch (error) {
    console.error('Create datacenter error:', error);
    res.status(500).json({ error: 'Failed to create datacenter' });
  }
});

// Pages management
router.get('/pages', async (req, res) => {
  try {
    const pages = await db.query('SELECT * FROM pages ORDER BY title');
    res.json({ pages });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Failed to load pages' });
  }
});

router.post('/pages', async (req, res) => {
  try {
    const { title, slug, content, meta_title, meta_description, is_published } = req.body;
    
    await db.query(`
      INSERT INTO pages (slug, title, content, meta_title, meta_description, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [slug || slugify(title, { lower: true, strict: true }), title, content, meta_title, meta_description, is_published !== false]);

    res.status(201).json({ message: 'Page created successfully' });
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

router.put('/pages/:id', async (req, res) => {
  try {
    const { title, content, meta_title, meta_description, is_published } = req.body;
    
    await db.query(`
      UPDATE pages SET title = ?, content = ?, meta_title = ?, meta_description = ?, is_published = ?
      WHERE id = ?
    `, [title, content, meta_title, meta_description, is_published, req.params.id]);

    res.json({ message: 'Page updated successfully' });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// Activity logs
router.get('/activity', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const logs = await db.query(`
      SELECT al.*, u.email, u.first_name, u.last_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    res.json({ logs });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to load activity' });
  }
});

// Email logs
router.get('/email-logs', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Check if table exists
    const tableCheck = await db.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'email_logs'
    `);
    
    if (!tableCheck[0]?.count) {
      return res.json({ 
        logs: [], 
        total: 0, 
        stats: { total: 0, sent: 0, failed: 0, pending: 0 } 
      });
    }

    let whereClause = '';
    const params = [];

    if (search) {
      whereClause = "WHERE (recipient_email LIKE ? OR subject LIKE ? OR recipient_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause = whereClause ? `${whereClause} AND status = ?` : 'WHERE status = ?';
      params.push(status);
    }

    // Get stats
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM email_logs
    `);

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as count FROM email_logs ${whereClause}`,
      params
    );

    // Get logs
    const logs = await db.query(`
      SELECT el.*, u.email as user_email, u.first_name, u.last_name
      FROM email_logs el
      LEFT JOIN users u ON el.user_id = u.id
      ${whereClause}
      ORDER BY el.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    res.json({
      logs,
      total: Number(countResult[0]?.count || 0),
      stats: {
        total: Number(statsResult[0]?.total || 0),
        sent: Number(statsResult[0]?.sent || 0),
        failed: Number(statsResult[0]?.failed || 0),
        pending: Number(statsResult[0]?.pending || 0)
      }
    });
  } catch (error) {
    console.error('Get email logs error:', error);
    res.json({ 
      logs: [], 
      total: 0, 
      stats: { total: 0, sent: 0, failed: 0, pending: 0 } 
    });
  }
});

// Get single email log
router.get('/email-logs/:uuid', async (req, res) => {
  try {
    const logs = await db.query(
      'SELECT * FROM email_logs WHERE uuid = ?',
      [req.params.uuid]
    );

    if (!logs.length) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ log: logs[0] });
  } catch (error) {
    console.error('Get email log error:', error);
    res.status(500).json({ error: 'Failed to load email' });
  }
});

module.exports = router;
