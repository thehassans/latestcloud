const express = require('express');
const db = require('../database/connection');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get public settings (no auth required)
router.get('/public', async (req, res) => {
  try {
    const settings = await db.query('SELECT setting_key, setting_value, setting_type FROM settings WHERE is_public = TRUE');
    
    const result = {};
    for (const s of settings) {
      if (s.setting_type === 'json') {
        try {
          result[s.setting_key] = JSON.parse(s.setting_value);
        } catch {
          result[s.setting_key] = s.setting_value;
        }
      } else if (s.setting_type === 'number') {
        result[s.setting_key] = parseFloat(s.setting_value);
      } else if (s.setting_type === 'boolean') {
        result[s.setting_key] = s.setting_value === 'true';
      } else {
        result[s.setting_key] = s.setting_value;
      }
    }

    res.json({ settings: result });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Get all settings (admin only)
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM settings';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, setting_key';

    const settings = await db.query(query, params);

    res.json({
      settings: settings.map(s => ({
        ...s,
        setting_value: s.setting_type === 'json' ? JSON.parse(s.setting_value || '{}') : s.setting_value
      }))
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Update settings (admin only)
router.put('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { settings } = req.body;

    for (const [key, value] of Object.entries(settings)) {
      const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      
      await db.query(`
        INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = ?
      `, [key, settingValue, settingValue]);
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Create or update single setting (admin only)
router.put('/:key', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { key } = req.params;
    const { value, type = 'string', category = 'general', is_public = false } = req.body;

    const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    await db.query(`
      INSERT INTO settings (setting_key, setting_value, setting_type, category, is_public)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE setting_value = ?, setting_type = ?, category = ?, is_public = ?
    `, [key, settingValue, type, category, is_public, settingValue, type, category, is_public]);

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Delete setting (admin only)
router.delete('/:key', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM settings WHERE setting_key = ?', [req.params.key]);
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// Get datacenters (public)
router.get('/datacenters', async (req, res) => {
  try {
    const datacenters = await db.query('SELECT * FROM datacenters WHERE is_active = TRUE ORDER BY name');
    res.json({ datacenters });
  } catch (error) {
    console.error('Get datacenters error:', error);
    res.status(500).json({ error: 'Failed to load datacenters' });
  }
});

// Get announcements (public)
router.get('/announcements', async (req, res) => {
  try {
    const { location } = req.query;
    
    let query = `
      SELECT * FROM announcements 
      WHERE is_active = TRUE
      AND (starts_at IS NULL OR starts_at <= NOW())
      AND (expires_at IS NULL OR expires_at > NOW())
    `;

    if (location === 'home') {
      query += ' AND show_on_home = TRUE';
    } else if (location === 'dashboard') {
      query += ' AND show_on_dashboard = TRUE';
    }

    query += ' ORDER BY created_at DESC';

    const announcements = await db.query(query);
    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to load announcements' });
  }
});

// Get translations
router.get('/translations/:locale', async (req, res) => {
  try {
    const translations = await db.query('SELECT translation_key, translation_value FROM translations WHERE locale = ?', [req.params.locale]);
    
    const result = {};
    for (const t of translations) {
      result[t.translation_key] = t.translation_value;
    }

    res.json({ translations: result });
  } catch (error) {
    console.error('Get translations error:', error);
    res.status(500).json({ error: 'Failed to load translations' });
  }
});

// Currency conversion rates (mock - in production, use real API)
router.get('/currencies', async (req, res) => {
  try {
    const rates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      BDT: 110,
      INR: 83,
      SGD: 1.35,
      AUD: 1.53
    };

    res.json({ base: 'USD', rates });
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ error: 'Failed to load currencies' });
  }
});

module.exports = router;
