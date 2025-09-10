# EcoHaul Supabase Setup Guide

## Overview
This guide will help you set up Supabase for your EcoHaul Spring Boot backend. Supabase provides:
- PostgreSQL database
- Authentication (with JWT)
- Real-time subscriptions
- Row Level Security (RLS)
- RESTful APIs

## Step 1: Create Supabase Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)
2. **Sign Up/Login**: Create an account or login
3. **Create New Project**:
   - Click "New Project"
   - Choose your organization
   - Project name: `ecohaul-backend`
   - Database password: Choose a strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project"

## Step 2: Get Your Supabase Credentials

After your project is created, go to **Settings > API**:

```bash
# You'll need these values:
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Get Database Connection Details

Go to **Settings > Database**:

```bash
# Database connection info:
SUPABASE_DB_URL=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your-database-password
```

## Step 4: Create Environment Variables File

Create a `.env` file in your backend directory:

```bash
# Database Configuration
SUPABASE_DB_URL=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_DB_DRIVER=org.postgresql.Driver

# JPA Configuration
JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
JPA_DDL_AUTO=update
H2_CONSOLE_ENABLED=false

# Supabase API Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-should-be-long-and-random
JWT_EXPIRATION=86400000
```

## Step 5: Create EcoHaul Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposal Centers table
CREATE TABLE public.disposal_centers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    operating_hours JSONB,
    services JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposal Agents table
CREATE TABLE public.disposal_agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    license_number TEXT UNIQUE,
    service_areas JSONB,
    specializations JSONB,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste Categories table
CREATE TABLE public.waste_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    disposal_instructions JSONB,
    environmental_impact TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items table
CREATE TABLE public.cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    waste_category_id UUID REFERENCES public.waste_categories(id),
    item_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    estimated_weight DECIMAL(10, 2),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disposal Requests table
CREATE TABLE public.disposal_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.disposal_agents(id),
    center_id UUID REFERENCES public.disposal_centers(id),
    request_type TEXT CHECK (request_type IN ('pickup', 'drop_off')),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    pickup_address TEXT,
    pickup_date TIMESTAMP WITH TIME ZONE,
    items JSONB NOT NULL,
    total_estimated_weight DECIMAL(10, 2),
    special_instructions TEXT,
    total_cost DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE public.disposal_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_items_disposed INTEGER DEFAULT 0,
    total_weight_disposed DECIMAL(10, 2) DEFAULT 0.00,
    environmental_impact_score DECIMAL(5, 2) DEFAULT 0.00,
    carbon_footprint_reduced DECIMAL(10, 2) DEFAULT 0.00,
    waste_categories_breakdown JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample waste categories
INSERT INTO public.waste_categories (name, description, disposal_instructions, environmental_impact) VALUES
('Electronics', 'Electronic devices and components', '{"steps": ["Remove batteries", "Wipe personal data", "Take to certified e-waste center"]}', 'Contains valuable metals that can be recycled'),
('Batteries', 'All types of batteries', '{"steps": ["Never throw in regular trash", "Take to battery collection point", "Keep terminals covered"]}', 'Prevents toxic chemicals from entering landfills'),
('Plastic', 'Plastic containers and materials', '{"steps": ["Clean containers", "Check recycling number", "Sort by type"]}', 'Reduces ocean pollution and landfill waste'),
('Glass', 'Glass containers and materials', '{"steps": ["Remove caps and lids", "Rinse clean", "Sort by color"]}', 'Infinitely recyclable with no quality loss'),
('Paper', 'Paper and cardboard materials', '{"steps": ["Remove staples and clips", "Keep dry", "Separate by type"]}', 'Saves trees and reduces water usage'),
('Organic Waste', 'Food scraps and organic materials', '{"steps": ["Compost if possible", "Use municipal organic waste program", "Avoid meat and dairy in home compost"]}', 'Reduces methane emissions from landfills');
```

## Step 6: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disposal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disposal_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own disposal requests" ON public.disposal_requests
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.disposal_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- Public read access for reference data
CREATE POLICY "Anyone can view waste categories" ON public.waste_categories
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view disposal centers" ON public.disposal_centers
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view disposal agents" ON public.disposal_agents
    FOR SELECT USING (true);
```

## Step 7: Test Your Setup

1. Start your Spring Boot application with the new environment variables
2. Check that it connects to Supabase PostgreSQL
3. Test the `/health` endpoint
4. Verify tables are created properly

## Next Steps

1. **Authentication Integration**: Configure Spring Security with Supabase JWT
2. **Entity Classes**: Create JPA entities matching your Supabase tables
3. **Repository Layer**: Create Spring Data JPA repositories
4. **Service Layer**: Implement business logic
5. **Controller Layer**: Create REST endpoints

## Environment Variables Summary

Remember to set these environment variables before starting your Spring Boot application:

```bash
export SUPABASE_DB_URL="jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres"
export SUPABASE_DB_USERNAME="postgres"
export SUPABASE_DB_PASSWORD="your-password"
export SUPABASE_DB_DRIVER="org.postgresql.Driver"
export JPA_DATABASE_PLATFORM="org.hibernate.dialect.PostgreSQLDialect"
export JPA_DDL_AUTO="update"
export H2_CONSOLE_ENABLED="false"
export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export JWT_SECRET="your-jwt-secret"
```

## Teaching Notes

This setup provides:
- **Production-ready database**: PostgreSQL with automatic backups
- **Built-in authentication**: JWT-based auth with user management
- **Real-time capabilities**: For live updates in your mobile app
- **Security**: Row Level Security ensures data privacy
- **Scalability**: Supabase handles scaling automatically
- **Developer experience**: SQL editor, API auto-generation, and monitoring

You're now ready to build a robust, scalable backend for EcoHaul! 🚀
