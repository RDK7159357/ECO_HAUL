-- ============================================================================
-- EcoHaul Database Schema for Supabase (PostgreSQL)
-- Generated from Spring Boot JPA Entities
-- Date: September 10, 2025
-- ============================================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address TEXT,
    profile_image_url VARCHAR(255),
    role VARCHAR(255) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    eco_points INTEGER DEFAULT 0,
    total_scans INTEGER DEFAULT 0,
    total_pickups INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================================
-- 2. DISPOSAL_CENTERS TABLE
-- ============================================================================
CREATE TABLE disposal_centers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone_number VARCHAR(255),
    email VARCHAR(255),
    operating_hours VARCHAR(255),
    accepted_waste_types VARCHAR(255),
    pickup_service_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating DOUBLE PRECISION DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for location-based queries
CREATE INDEX idx_disposal_centers_location ON disposal_centers(latitude, longitude);
CREATE INDEX idx_disposal_centers_active ON disposal_centers(is_active);
CREATE INDEX idx_disposal_centers_pickup ON disposal_centers(pickup_service_available);

-- ============================================================================
-- 3. DISPOSAL_AGENTS TABLE
-- ============================================================================
CREATE TABLE disposal_agents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    email VARCHAR(255),
    vehicle_type VARCHAR(255),
    license_plate VARCHAR(255),
    coverage_area VARCHAR(255),
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    rating DOUBLE PRECISION DEFAULT 0.0,
    total_pickups INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for agent queries
CREATE INDEX idx_disposal_agents_location ON disposal_agents(current_latitude, current_longitude);
CREATE INDEX idx_disposal_agents_available ON disposal_agents(is_available);
CREATE INDEX idx_disposal_agents_active ON disposal_agents(is_active);

-- ============================================================================
-- 4. WASTE_RECORDS TABLE
-- ============================================================================
CREATE TABLE waste_records (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    waste_type VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    scan_image_url VARCHAR(255),
    confidence_score DOUBLE PRECISION,
    is_recyclable BOOLEAN DEFAULT FALSE,
    weight DOUBLE PRECISION,
    estimated_value DOUBLE PRECISION,
    disposal_status VARCHAR(255) DEFAULT 'PENDING',
    disposal_instructions TEXT,
    disposal_center_id BIGINT REFERENCES disposal_centers(id),
    pickup_agent_id BIGINT REFERENCES disposal_agents(id),
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disposed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for waste records
CREATE INDEX idx_waste_records_user ON waste_records(user_id);
CREATE INDEX idx_waste_records_status ON waste_records(disposal_status);
CREATE INDEX idx_waste_records_type ON waste_records(waste_type);
CREATE INDEX idx_waste_records_date ON waste_records(scanned_at);

-- ============================================================================
-- 5. CART_ITEMS TABLE
-- ============================================================================
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    waste_record_id BIGINT REFERENCES waste_records(id),
    waste_type VARCHAR(255),
    category VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    weight DOUBLE PRECISION,
    estimated_value DOUBLE PRECISION,
    pickup_preference VARCHAR(255) DEFAULT 'IMMEDIATE',
    special_instructions TEXT,
    is_ready_for_pickup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for cart operations
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_ready ON cart_items(is_ready_for_pickup);
CREATE INDEX idx_cart_items_preference ON cart_items(pickup_preference);

-- ============================================================================
-- 6. USER_FEEDBACK TABLE
-- ============================================================================
CREATE TABLE user_feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(255),
    priority VARCHAR(255) DEFAULT 'MEDIUM',
    status VARCHAR(255) DEFAULT 'OPEN',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    ticket_number VARCHAR(255) UNIQUE,
    attachment_urls TEXT,
    admin_response TEXT,
    admin_responder_id BIGINT REFERENCES users(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for feedback management
CREATE INDEX idx_feedback_user ON user_feedback(user_id);
CREATE INDEX idx_feedback_status ON user_feedback(status);
CREATE INDEX idx_feedback_type ON user_feedback(type);
CREATE INDEX idx_feedback_priority ON user_feedback(priority);
CREATE INDEX idx_feedback_ticket ON user_feedback(ticket_number);

-- ============================================================================
-- 7. ENUMS AND CHECK CONSTRAINTS
-- ============================================================================

-- User roles enum
ALTER TABLE users ADD CONSTRAINT chk_users_role 
CHECK (role IN ('USER', 'ADMIN', 'AGENT', 'CENTER_MANAGER'));

-- Disposal status enum
ALTER TABLE waste_records ADD CONSTRAINT chk_waste_disposal_status 
CHECK (disposal_status IN ('PENDING', 'IN_CART', 'SCHEDULED', 'PICKED_UP', 'DISPOSED', 'CANCELLED'));

-- Pickup preference enum
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_pickup_preference 
CHECK (pickup_preference IN ('IMMEDIATE', 'SCHEDULED', 'FLEXIBLE'));

-- Feedback type enum
ALTER TABLE user_feedback ADD CONSTRAINT chk_feedback_type 
CHECK (type IN ('BUG_REPORT', 'FEATURE_REQUEST', 'COMPLAINT', 'SUGGESTION', 'COMPLIMENT', 'GENERAL'));

-- Feedback status enum
ALTER TABLE user_feedback ADD CONSTRAINT chk_feedback_status 
CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED'));

-- Feedback priority enum
ALTER TABLE user_feedback ADD CONSTRAINT chk_feedback_priority 
CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'));

-- ============================================================================
-- 8. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disposal_centers_updated_at BEFORE UPDATE ON disposal_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disposal_agents_updated_at BEFORE UPDATE ON disposal_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waste_records_updated_at BEFORE UPDATE ON waste_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_feedback_updated_at BEFORE UPDATE ON user_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. SAMPLE DATA INSERTION (OPTIONAL)
-- ============================================================================

-- Insert sample disposal centers
INSERT INTO disposal_centers (name, address, latitude, longitude, phone_number, email, operating_hours, accepted_waste_types, pickup_service_available, is_active, rating) VALUES
('EcoCenter Downtown', '123 Green Street, Downtown City', 40.7128, -74.0060, '+1-555-0101', 'downtown@ecocenter.com', 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM', 'Plastic,Glass,Metal,Paper', true, true, 4.5),
('RecycleHub North', '456 Recycle Ave, North District', 40.7589, -73.9851, '+1-555-0102', 'north@recyclehub.com', 'Mon-Sat: 7AM-7PM', 'Electronics,Batteries,Plastic,Metal', true, true, 4.2),
('GreenPoint Center', '789 Eco Lane, West Side', 40.7282, -74.0776, '+1-555-0103', 'info@greenpoint.com', 'Daily: 6AM-8PM', 'All Types', true, true, 4.7);

-- Insert sample disposal agents
INSERT INTO disposal_agents (name, phone_number, email, vehicle_type, license_plate, coverage_area, current_latitude, current_longitude, is_active, is_available, rating, total_pickups) VALUES
('John Pickup', '+1-555-0201', 'john@ecohaul.com', 'Truck', 'ECO-001', 'Downtown Area', 40.7128, -74.0060, true, true, 4.8, 150),
('Sarah Green', '+1-555-0202', 'sarah@ecohaul.com', 'Van', 'ECO-002', 'North District', 40.7589, -73.9851, true, true, 4.6, 120),
('Mike Recycle', '+1-555-0203', 'mike@ecohaul.com', 'Truck', 'ECO-003', 'West Side', 40.7282, -74.0776, true, false, 4.9, 200);

-- Insert sample admin user
INSERT INTO users (email, full_name, password, phone_number, role, is_active, eco_points) VALUES
('admin@ecohaul.com', 'EcoHaul Admin', '$2a$10$encrypted_password_hash', '+1-555-0001', 'ADMIN', true, 0),
('test@example.com', 'Test User', '$2a$10$encrypted_password_hash', '+1-555-0123', 'USER', true, 150);

-- ============================================================================
-- 10. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.eco_points,
    u.total_scans,
    u.total_pickups,
    COUNT(wr.id) as total_waste_records,
    COUNT(ci.id) as current_cart_items,
    COALESCE(SUM(wr.weight), 0) as total_waste_weight,
    COALESCE(SUM(wr.estimated_value), 0) as total_waste_value
FROM users u
LEFT JOIN waste_records wr ON u.id = wr.user_id
LEFT JOIN cart_items ci ON u.id = ci.user_id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.email, u.eco_points, u.total_scans, u.total_pickups;

-- View for disposal center statistics
CREATE VIEW disposal_center_stats AS
SELECT 
    dc.id,
    dc.name,
    dc.address,
    dc.rating,
    dc.total_reviews,
    COUNT(wr.id) as total_disposals,
    COALESCE(SUM(wr.weight), 0) as total_weight_processed
FROM disposal_centers dc
LEFT JOIN waste_records wr ON dc.id = wr.disposal_center_id
WHERE dc.is_active = true
GROUP BY dc.id, dc.name, dc.address, dc.rating, dc.total_reviews;

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid()::text = id::text OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::bigint AND role = 'ADMIN'));

-- Policy: Users can only see their own waste records
CREATE POLICY waste_records_own_data ON waste_records
    FOR ALL USING (user_id = auth.uid()::bigint OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::bigint AND role IN ('ADMIN', 'AGENT')));

-- Policy: Users can only see their own cart items
CREATE POLICY cart_items_own_data ON cart_items
    FOR ALL USING (user_id = auth.uid()::bigint OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::bigint AND role IN ('ADMIN', 'AGENT')));

-- Policy: Users can only see their own feedback
CREATE POLICY feedback_own_data ON user_feedback
    FOR ALL USING (user_id = auth.uid()::bigint OR 
                   EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::bigint AND role = 'ADMIN'));

-- ============================================================================
-- 12. FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================================

-- Function to calculate eco points based on waste disposal
CREATE OR REPLACE FUNCTION calculate_eco_points(waste_weight DOUBLE PRECISION, waste_type VARCHAR)
RETURNS INTEGER AS $$
BEGIN
    CASE waste_type
        WHEN 'Plastic' THEN RETURN ROUND(waste_weight * 10)::INTEGER;
        WHEN 'Glass' THEN RETURN ROUND(waste_weight * 8)::INTEGER;
        WHEN 'Metal' THEN RETURN ROUND(waste_weight * 15)::INTEGER;
        WHEN 'Paper' THEN RETURN ROUND(waste_weight * 5)::INTEGER;
        WHEN 'Electronic' THEN RETURN ROUND(waste_weight * 20)::INTEGER;
        ELSE RETURN ROUND(waste_weight * 3)::INTEGER;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update user eco points when waste is disposed
CREATE OR REPLACE FUNCTION update_user_eco_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.disposal_status = 'DISPOSED' AND OLD.disposal_status != 'DISPOSED' THEN
        UPDATE users 
        SET eco_points = eco_points + calculate_eco_points(NEW.weight, NEW.waste_type),
            total_pickups = total_pickups + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update eco points
CREATE TRIGGER update_eco_points_trigger
    AFTER UPDATE ON waste_records
    FOR EACH ROW
    EXECUTE FUNCTION update_user_eco_points();

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant necessary permissions (adjust as needed for your Supabase setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON DATABASE postgres IS 'EcoHaul Database - Waste Management and Detection System';
