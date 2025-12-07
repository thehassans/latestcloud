const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const slugify = require('slugify');
const db = require('../database/connection');
const { authenticate, requireRole } = require('../middleware/auth');

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

    const [orders, services, tickets] = await Promise.all([
      db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id]),
      db.query('SELECT * FROM services WHERE user_id = ? ORDER BY created_at DESC', [user.id]),
      db.query('SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [user.id])
    ]);

    res.json({ user, orders, services, tickets });
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
    
    await db.query(`
      UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status)
      WHERE uuid = ?
    `, [status, payment_status, req.params.uuid]);

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
    
    const tickets = await db.query('SELECT * FROM tickets WHERE uuid = ?', [req.params.uuid]);
    if (!tickets.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await db.query(`
      INSERT INTO ticket_replies (ticket_id, user_id, message, is_staff_reply)
      VALUES (?, ?, ?, TRUE)
    `, [tickets[0].id, req.user.id, message]);

    await db.query(`
      UPDATE tickets SET status = 'answered', updated_at = NOW()
      WHERE id = ?
    `, [tickets[0].id]);

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

module.exports = router;
