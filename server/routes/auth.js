const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { authenticate, generateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, first_name, last_name, phone, company } = req.body;

    // Check if email exists
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const uuid = uuidv4();

    await db.query(`
      INSERT INTO users (uuid, email, password, first_name, last_name, phone, company, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'user', 'active')
    `, [uuid, email, hashedPassword, first_name, last_name, phone || null, company || null]);

    const token = generateToken({ uuid, email, role: 'user' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'Registration successful',
      user: { uuid, email, first_name, last_name, role: 'user' },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login (ignore if column doesn't exist)
    try {
      await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
    } catch (e) {
      // Ignore - column might not exist
    }

    const token = generateToken({ uuid: user.uuid, email: user.email, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        uuid: user.uuid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const users = await db.query(`
      SELECT uuid, email, first_name, last_name, phone, company, address, city, state, country, postal_code, avatar, role, preferred_language, preferred_currency, created_at
      FROM users WHERE id = ?
    `, [req.user.id]);

    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update profile
router.put('/profile', authenticate, [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('country').optional().trim(),
  body('postal_code').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, company, address, city, state, country, postal_code, preferred_language, preferred_currency } = req.body;

    await db.query(`
      UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        company = COALESCE(?, company),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        country = COALESCE(?, country),
        postal_code = COALESCE(?, postal_code),
        preferred_language = COALESCE(?, preferred_language),
        preferred_currency = COALESCE(?, preferred_currency)
      WHERE id = ?
    `, [first_name, last_name, phone, company, address, city, state, country, postal_code, preferred_language, preferred_currency, req.user.id]);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authenticate, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { current_password, new_password } = req.body;

    const users = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const validPassword = await bcrypt.compare(current_password, users[0].password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const { email } = req.body;
    
    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    // Always return success to prevent email enumeration
    if (!users.length) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await db.query(`
      UPDATE users SET password_reset_token = ?, password_reset_expires = ?
      WHERE id = ?
    `, [resetToken, expires, users[0].id]);

    // TODO: Send email with reset link

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
