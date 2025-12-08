const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// Get all service cards (public)
router.get('/', async (req, res) => {
  try {
    const cards = await db.query(`
      SELECT * FROM service_cards 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC
    `);
    res.json(cards || []);
  } catch (error) {
    console.error('Get service cards error:', error);
    res.status(500).json({ error: 'Failed to load service cards' });
  }
});

// Get all service cards for admin (including inactive)
router.get('/admin', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const cards = await db.query(`
      SELECT * FROM service_cards 
      ORDER BY display_order ASC
    `);
    res.json(cards || []);
  } catch (error) {
    console.error('Get admin service cards error:', error);
    res.status(500).json({ error: 'Failed to load service cards' });
  }
});

// Create service card
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { title, description, price, link, icon, image_url, display_order, is_active } = req.body;
    
    const result = await db.query(`
      INSERT INTO service_cards (title, description, price, link, icon, image_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, price, link, icon || 'Server', image_url, display_order || 0, is_active !== false]);
    
    res.json({ success: true, id: result.insertId, message: 'Service card created' });
  } catch (error) {
    console.error('Create service card error:', error);
    res.status(500).json({ error: 'Failed to create service card' });
  }
});

// Update service card
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, link, icon, image_url, display_order, is_active } = req.body;
    
    await db.query(`
      UPDATE service_cards 
      SET title = ?, description = ?, price = ?, link = ?, icon = ?, image_url = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `, [title, description, price, link, icon, image_url, display_order, is_active, id]);
    
    res.json({ success: true, message: 'Service card updated' });
  } catch (error) {
    console.error('Update service card error:', error);
    res.status(500).json({ error: 'Failed to update service card' });
  }
});

// Delete service card
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM service_cards WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service card deleted' });
  } catch (error) {
    console.error('Delete service card error:', error);
    res.status(500).json({ error: 'Failed to delete service card' });
  }
});

// Reorder service cards
router.put('/reorder', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { orders } = req.body; // [{id: 1, order: 0}, {id: 2, order: 1}...]
    
    for (const item of orders) {
      await db.query('UPDATE service_cards SET display_order = ? WHERE id = ?', [item.order, item.id]);
    }
    
    res.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Reorder service cards error:', error);
    res.status(500).json({ error: 'Failed to reorder' });
  }
});

module.exports = router;
