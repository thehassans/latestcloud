-- Service Cards Table
CREATE TABLE IF NOT EXISTS service_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  link VARCHAR(255) NOT NULL,
  icon VARCHAR(50) DEFAULT 'Server',
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default service cards
INSERT INTO service_cards (title, description, price, link, icon, display_order) VALUES
('Web Hosting', 'Fast & reliable shared hosting', 2.99, '/services/hosting', 'Server', 1),
('VPS Servers', 'Full root access & control', 9.99, '/services/vps', 'Cloud', 2),
('Cloud Servers', 'Scalable cloud infrastructure', 24.99, '/services/cloud', 'Cloud', 3),
('Dedicated Servers', 'Maximum performance', 99.99, '/services/dedicated', 'Database', 4),
('Domains', 'Register your perfect domain', 2.99, '/domains', 'Globe', 5),
('SSL Certificates', 'Secure your website', 9.99, '/services/ssl', 'Shield', 6),
('Professional Email', 'Business email solutions', 1.99, '/services/email', 'Mail', 7),
('Website Backup', 'Automated backups', 2.99, '/services/backup', 'Archive', 8);
