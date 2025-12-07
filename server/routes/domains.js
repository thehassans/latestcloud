const express = require('express');
const db = require('../database/connection');

const router = express.Router();

// Search domain availability (mock - in production, connect to registrar API)
router.get('/search', async (req, res) => {
  try {
    const { domain } = req.query;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain name is required' });
    }

    // Extract domain name without TLD
    const domainParts = domain.toLowerCase().replace(/[^a-z0-9.-]/g, '').split('.');
    const domainName = domainParts[0];
    
    if (!domainName || domainName.length < 2) {
      return res.status(400).json({ error: 'Invalid domain name' });
    }

    // Get all TLDs
    const tlds = await db.query('SELECT * FROM domain_tlds WHERE is_active = TRUE ORDER BY is_popular DESC, price_register');

    // Simulate availability check (in production, call registrar API)
    const results = tlds.map(tld => {
      const fullDomain = `${domainName}${tld.tld}`;
      // Simulate random availability
      const available = Math.random() > 0.3;
      
      return {
        domain: fullDomain,
        tld: tld.tld,
        available,
        price_register: parseFloat(tld.price_register),
        price_renew: parseFloat(tld.price_renew),
        price_transfer: parseFloat(tld.price_transfer),
        promo_price: tld.promo_price ? parseFloat(tld.promo_price) : null,
        is_popular: tld.is_popular
      };
    });

    // Sort: available first, then popular, then by price
    results.sort((a, b) => {
      if (a.available !== b.available) return b.available - a.available;
      if (a.is_popular !== b.is_popular) return b.is_popular - a.is_popular;
      return a.price_register - b.price_register;
    });

    res.json({
      search_term: domainName,
      results
    });
  } catch (error) {
    console.error('Domain search error:', error);
    res.status(500).json({ error: 'Failed to search domains' });
  }
});

// Get TLD pricing
router.get('/tlds', async (req, res) => {
  try {
    const { popular_only } = req.query;
    
    let query = 'SELECT * FROM domain_tlds WHERE is_active = TRUE';
    if (popular_only === 'true') {
      query += ' AND is_popular = TRUE';
    }
    query += ' ORDER BY is_popular DESC, price_register';

    const tlds = await db.query(query);

    res.json({
      tlds: tlds.map(t => ({
        ...t,
        price_register: parseFloat(t.price_register),
        price_renew: parseFloat(t.price_renew),
        price_transfer: parseFloat(t.price_transfer),
        promo_price: t.promo_price ? parseFloat(t.promo_price) : null
      }))
    });
  } catch (error) {
    console.error('Get TLDs error:', error);
    res.status(500).json({ error: 'Failed to load TLDs' });
  }
});

// Check single domain availability
router.get('/check/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    // In production, call registrar API
    const available = Math.random() > 0.3;

    // Get TLD pricing
    const tld = '.' + domain.split('.').slice(1).join('.');
    const tlds = await db.query('SELECT * FROM domain_tlds WHERE tld = ?', [tld]);

    res.json({
      domain,
      available,
      pricing: tlds.length ? {
        register: parseFloat(tlds[0].price_register),
        renew: parseFloat(tlds[0].price_renew),
        transfer: parseFloat(tlds[0].price_transfer)
      } : null
    });
  } catch (error) {
    console.error('Check domain error:', error);
    res.status(500).json({ error: 'Failed to check domain' });
  }
});

// Get WHOIS info (mock)
router.get('/whois/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    // In production, query WHOIS server
    res.json({
      domain,
      registrar: 'Magnetic Clouds',
      status: 'active',
      created_date: '2020-01-01',
      expiry_date: '2025-01-01',
      nameservers: ['ns1.magneticclouds.com', 'ns2.magneticclouds.com']
    });
  } catch (error) {
    console.error('WHOIS error:', error);
    res.status(500).json({ error: 'Failed to get WHOIS info' });
  }
});

module.exports = router;
