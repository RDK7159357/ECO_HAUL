# Supabase Connection Guide for EcoHaul Backend

## Step 1: Get Your Supabase Database Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings > Database**
3. Copy the connection details:

### Connection Details You'll Need:
- **Host**: `db.[your-project-ref].supabase.co`
- **Database name**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: [The password you set during project creation]

## Step 2: Set Environment Variables

Create a `.env` file in your backend root directory or set these environment variables:

```bash
# Database Configuration
SUPABASE_DB_URL=jdbc:postgresql://db.[your-project-ref].supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=[your-database-password]

# Supabase API Configuration
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# JWT Configuration
JWT_SECRET=[generate-a-strong-secret-key]
JWT_EXPIRATION=86400000
```

## Step 3: Get API Keys

1. Go to **Settings > API** in your Supabase dashboard
2. Copy these keys:
   - **anon public key** (for frontend)
   - **service_role secret key** (for backend admin operations)

## Step 4: Test the Connection

Run your Spring Boot application:
```bash
cd /Users/ramadugudhanush/Documents/EcoHaul/Ecohaul_backend/backend
mvn spring-boot:run
```

Check the logs for successful database connection.

## Step 5: Enable Row Level Security (RLS)

In Supabase SQL Editor, run these commands:

```sql
-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposal_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE disposal_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies (example for users table)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id::text);
```

## Step 6: Set Up Authentication

Your backend is already configured to work with Supabase Auth. The JWT tokens from Supabase frontend will work with your Spring Boot backend.

## Database Schema Creation

When you start the application, Spring Boot will automatically create tables based on your entity models thanks to `spring.jpa.hibernate.ddl-auto=update` in application.properties.

## Testing Endpoints

Once connected, test your APIs:

```bash
# Health check
curl http://localhost:8080/api/v1/health

# Get waste types
curl http://localhost:8080/api/v1/waste-scanner/waste-types

# Get disposal centers
curl http://localhost:8080/api/v1/disposal/centers
```

Your backend is ready for Supabase integration!
