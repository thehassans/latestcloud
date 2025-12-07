const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard stats
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const [services, tickets, invoices, orders] = await Promise.all([
      db.query(`SELECT COUNT(*) as total, 
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
        FROM services WHERE user_id = ?`, [req.user.id]),
      db.query(`SELECT COUNT(*) as total,
        SUM(CASE WHEN status IN ('open', 'customer-reply') THEN 1 ELSE 0 END) as open
        FROM tickets WHERE user_id = ?`, [req.user.id]),
      db.query(`SELECT COUNT(*) as total,
        SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid
        FROM invoices WHERE user_id = ?`, [req.user.id]),
      db.query(`SELECT COUNT(*) as total FROM orders WHERE user_id = ?`, [req.user.id])
    ]);

    // Recent activity
    const recentServices = await db.query(`
      SELECT uuid, name, service_type, status, next_due_date, created_at
      FROM services WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
    `, [req.user.id]);

    const recentInvoices = await db.query(`
      SELECT uuid, invoice_number, total, status, due_date, created_at
      FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
    `, [req.user.id]);

    const recentTickets = await db.query(`
      SELECT uuid, ticket_number, subject, status, priority, created_at
      FROM tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 5
    `, [req.user.id]);

    res.json({
      stats: {
        services: { total: Number(services[0].total), active: Number(services[0].active) },
        tickets: { total: Number(tickets[0].total), open: Number(tickets[0].open) },
        invoices: { total: Number(invoices[0].total), unpaid: Number(invoices[0].unpaid) },
        orders: { total: Number(orders[0].total) }
      },
      recent: {
        services: recentServices,
        invoices: recentInvoices,
        tickets: recentTickets
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Get user services
router.get('/services', authenticate, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM services WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (type) {
      query += ' AND service_type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const services = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM services WHERE user_id = ?', [req.user.id]);

    res.json({
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
});

// Get service details
router.get('/services/:uuid', authenticate, async (req, res) => {
  try {
    const services = await db.query(`
      SELECT s.*, p.name as product_name, p.features as product_features
      FROM services s
      LEFT JOIN products p ON s.product_id = p.id
      WHERE s.uuid = ? AND s.user_id = ?
    `, [req.params.uuid, req.user.id]);

    if (!services.length) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service: services[0] });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to load service' });
  }
});

// Get user invoices
router.get('/invoices', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM invoices WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const invoices = await db.query(query, params);
    const countResult = await db.query('SELECT COUNT(*) as total FROM invoices WHERE user_id = ?', [req.user.id]);

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

// Get invoice details
router.get('/invoices/:uuid', authenticate, async (req, res) => {
  try {
    const invoices = await db.query('SELECT * FROM invoices WHERE uuid = ? AND user_id = ?', [req.params.uuid, req.user.id]);

    if (!invoices.length) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ invoice: invoices[0] });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to load invoice' });
  }
});

// Get user transactions
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const transactions = await db.query(`
      SELECT * FROM transactions WHERE user_id = ?
      ORDER BY created_at DESC LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(limit), parseInt(offset)]);

    const countResult = await db.query('SELECT COUNT(*) as total FROM transactions WHERE user_id = ?', [req.user.id]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Number(countResult[0].total)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to load transactions' });
  }
});

module.exports = router;
