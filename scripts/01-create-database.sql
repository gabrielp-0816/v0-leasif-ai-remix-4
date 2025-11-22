-- LeasifAI Database Schema
-- Create all tables for the application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('landlord', 'tenant')),
  avatar VARCHAR(500),
  bio TEXT,
  company VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  properties_owned INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  budget DECIMAL(10, 2),
  move_in_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(36) PRIMARY KEY,
  landlord_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size_sqft INT,
  bedrooms INT,
  bathrooms DECIMAL(3, 1),
  amenities JSON,
  images JSON,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  rating DECIMAL(2, 1) DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id VARCHAR(36) PRIMARY KEY,
  property_id VARCHAR(36) NOT NULL,
  landlord_id VARCHAR(36) NOT NULL,
  tenant_id VARCHAR(36) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired', 'terminated')),
  terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  property_id VARCHAR(36),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id)
);

-- Feasibility Studies table
CREATE TABLE IF NOT EXISTS feasibility_studies (
  id VARCHAR(36) PRIMARY KEY,
  property_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  business_name VARCHAR(255),
  target_market TEXT,
  expected_revenue DECIMAL(12, 2),
  employee_count INT,
  ai_analysis JSON,
  success_rate DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  property_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, property_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_contracts_landlord ON contracts(landlord_id);
CREATE INDEX idx_contracts_tenant ON contracts(tenant_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_feasibility_user ON feasibility_studies(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
