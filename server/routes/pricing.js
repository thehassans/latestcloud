const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

// Default pricing structure
const defaultPricing = {
  hosting: [
    { id: 'starter', name: 'Starter Hosting', price: 2.99, features: ['1 Website', '10 GB SSD Storage', 'Free SSL Certificate', 'Weekly Backups', '24/7 Support', 'cPanel Access'] },
    { id: 'professional', name: 'Professional Hosting', price: 5.99, popular: true, features: ['Unlimited Websites', '50 GB SSD Storage', 'Free SSL Certificate', 'Daily Backups', 'Priority Support', 'cPanel Access', 'Free Domain'] },
    { id: 'business', name: 'Business Hosting', price: 9.99, features: ['Unlimited Websites', '100 GB NVMe Storage', 'Free SSL Certificate', 'Real-time Backups', 'Dedicated Support', 'cPanel Access', 'Free Domain', 'Staging Environment'] }
  ],
  vps: [
    { id: 'starter', name: 'VPS Starter', price: 9.99, cpu: '2 vCPU', ram: '4 GB RAM', storage: '80 GB NVMe', bandwidth: '2 TB Transfer', features: ['Full Root Access', 'DDoS Protection', '99.9% Uptime SLA', 'Weekly Backups'] },
    { id: 'professional', name: 'VPS Professional', price: 24.99, popular: true, cpu: '4 vCPU', ram: '8 GB RAM', storage: '160 GB NVMe', bandwidth: '4 TB Transfer', features: ['Full Root Access', 'DDoS Protection', '99.9% Uptime SLA', 'Daily Backups', 'Priority Support'] },
    { id: 'business', name: 'VPS Business', price: 49.99, cpu: '8 vCPU', ram: '16 GB RAM', storage: '320 GB NVMe', bandwidth: '8 TB Transfer', features: ['Full Root Access', 'Advanced DDoS', '99.99% Uptime SLA', 'Real-time Backups', 'Dedicated Support', 'Free Migration'] }
  ],
  cloud: [
    { id: 'starter', name: 'Cloud Starter', price: 24.99, cpu: '4 vCPU', ram: '8 GB RAM', storage: '100 GB NVMe', bandwidth: '5 TB Transfer', features: ['Auto-scaling', 'Load Balancer', 'Managed Firewall', '99.9% Uptime'] },
    { id: 'professional', name: 'Cloud Professional', price: 49.99, popular: true, cpu: '8 vCPU', ram: '16 GB RAM', storage: '200 GB NVMe', bandwidth: '10 TB Transfer', features: ['Auto-scaling', 'Load Balancer', 'Managed Firewall', '99.99% Uptime', 'Private Network', 'Priority Support'] },
    { id: 'enterprise', name: 'Cloud Enterprise', price: 99.99, cpu: '16 vCPU', ram: '32 GB RAM', storage: '400 GB NVMe', bandwidth: 'Unlimited', features: ['Auto-scaling', 'Global CDN', 'Advanced DDoS', '99.99% Uptime', 'Dedicated Support', 'Custom Config'] }
  ],
  dedicated: [
    { id: 'starter', name: 'Starter Dedicated', price: 99.99, cpu: 'Intel Xeon E-2236', ram: '32 GB DDR4', storage: '1 TB NVMe SSD', features: ['Full Root Access', 'IPMI Access', '1 Gbps Port', 'DDoS Protection', '24/7 Support'] },
    { id: 'professional', name: 'Professional Dedicated', price: 199.99, popular: true, cpu: 'Intel Xeon E-2288G', ram: '64 GB DDR4', storage: '2 TB NVMe SSD', features: ['Full Root Access', 'IPMI Access', '10 Gbps Port', 'Advanced DDoS', 'Priority Support', 'Free Setup'] },
    { id: 'enterprise', name: 'Enterprise Dedicated', price: 399.99, cpu: 'Dual Intel Xeon Gold', ram: '128 GB DDR4', storage: '4 TB NVMe RAID', features: ['Full Root Access', 'IPMI Access', '10 Gbps Port', 'Premium DDoS', 'Dedicated Support', 'Free Setup', 'Hardware Customization'] }
  ],
  ssl: [
    { id: 'basic', name: 'Basic SSL', price: 9.99, validity: '1 Year', features: ['Domain Validation', 'Single Domain', '256-bit Encryption', 'Browser Trust', 'Quick Issuance'] },
    { id: 'business', name: 'Business SSL', price: 49.99, popular: true, validity: '1 Year', features: ['Organization Validation', 'Single Domain', '256-bit Encryption', 'Company Verified', 'Trust Seal', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise SSL', price: 199.99, validity: '1 Year', features: ['Extended Validation', 'Green Address Bar', 'Unlimited Subdomains', 'Premium Trust Seal', 'Warranty $1.75M', 'Dedicated Support'] }
  ],
  email: [
    { id: 'starter', name: 'Starter Email', price: 1.99, features: ['5 Email Accounts', '5 GB Storage/Account', 'Spam & Virus Protection', 'Webmail Access', 'Mobile Apps', 'Email Forwarding'] },
    { id: 'business', name: 'Business Email', price: 4.99, popular: true, features: ['25 Email Accounts', '25 GB Storage/Account', 'Advanced Spam Filter', 'Calendar & Contacts', 'Priority Support', 'Custom Signatures', 'Auto-responders'] },
    { id: 'enterprise', name: 'Enterprise Email', price: 9.99, features: ['Unlimited Accounts', '100 GB Storage/Account', 'AI Spam Protection', 'Team Collaboration', 'Admin Console', 'SSO Integration', 'Email Archiving', 'SLA Guarantee'] }
  ],
  backup: [
    { id: 'basic', name: 'Basic Backup', price: 2.99, features: ['10 GB Storage', '7 Days Retention', 'Daily Backups', 'One-Click Restore', 'File-Level Backup', 'Email Notifications'] },
    { id: 'pro', name: 'Pro Backup', price: 9.99, popular: true, features: ['50 GB Storage', '30 Days Retention', 'Hourly Backups', 'One-Click Restore', 'Database Backup', 'Staging Environment', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise Backup', price: 24.99, features: ['200 GB Storage', '90 Days Retention', 'Real-time Backup', 'Instant Restore', 'Full Server Backup', 'Offsite Storage', 'Disaster Recovery', 'SLA Guarantee'] }
  ]
};

// Get all pricing (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'service_pricing'");
    
    if (rows.length > 0 && rows[0].setting_value) {
      try {
        const pricing = JSON.parse(rows[0].setting_value);
        res.json(pricing);
      } catch (e) {
        res.json(defaultPricing);
      }
    } else {
      res.json(defaultPricing);
    }
  } catch (error) {
    console.error('Get pricing error:', error);
    res.json(defaultPricing);
  }
});

// Get pricing for specific service
router.get('/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const [rows] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'service_pricing'");
    
    let pricing = defaultPricing;
    if (rows.length > 0 && rows[0].setting_value) {
      try {
        pricing = JSON.parse(rows[0].setting_value);
      } catch (e) {}
    }
    
    if (pricing[service]) {
      res.json(pricing[service]);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error('Get service pricing error:', error);
    res.status(500).json({ error: 'Failed to load pricing' });
  }
});

// Save pricing (admin only)
router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { pricing } = req.body;
    
    if (!pricing) {
      return res.status(400).json({ error: 'Pricing data required' });
    }
    
    const pricingJson = JSON.stringify(pricing);
    
    // Check if exists
    const [exists] = await db.query("SELECT 1 FROM settings WHERE setting_key = 'service_pricing'");
    
    if (exists.length > 0) {
      await db.query("UPDATE settings SET setting_value = ? WHERE setting_key = 'service_pricing'", [pricingJson]);
    } else {
      await db.query("INSERT INTO settings (setting_key, setting_value) VALUES ('service_pricing', ?)", [pricingJson]);
    }
    
    res.json({ success: true, message: 'Pricing saved successfully' });
  } catch (error) {
    console.error('Save pricing error:', error);
    res.status(500).json({ error: 'Failed to save pricing' });
  }
});

// Reset to defaults (admin only)
router.post('/reset', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const pricingJson = JSON.stringify(defaultPricing);
    
    const [exists] = await db.query("SELECT 1 FROM settings WHERE setting_key = 'service_pricing'");
    
    if (exists.length > 0) {
      await db.query("UPDATE settings SET setting_value = ? WHERE setting_key = 'service_pricing'", [pricingJson]);
    } else {
      await db.query("INSERT INTO settings (setting_key, setting_value) VALUES ('service_pricing', ?)", [pricingJson]);
    }
    
    res.json({ success: true, pricing: defaultPricing });
  } catch (error) {
    console.error('Reset pricing error:', error);
    res.status(500).json({ error: 'Failed to reset pricing' });
  }
});

module.exports = router;
