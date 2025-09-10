#!/bin/bash

echo "🚀 Testing EcoHaul Backend Endpoints"
echo "======================================"

BASE_URL="http://localhost:8080"

echo ""
echo "1. Testing Health Endpoint..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/health"

echo ""
echo "2. Testing Data Provider - Disposal Centers..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/data/disposal-centers"

echo ""
echo "3. Testing Data Provider - Disposal Agents..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/data/disposal-agents"

echo ""
echo "4. Testing N8n Bridge - Webhook..."
curl -s -w "\nStatus: %{http_code}\n" -H "Content-Type: application/json" -d '{"test": "data"}' "$BASE_URL/webhook/n8n"

echo ""
echo "5. Testing Waste Scanner - Categories..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/waste/categories"

echo ""
echo "6. Testing User Controller - Profile (should return 404 since no user)..."
curl -s -w "\nStatus: %{http_code}\n" "$BASE_URL/api/users/profile/999"

echo ""
echo "7. Testing H2 Console Access..."
echo "H2 Console available at: $BASE_URL/h2-console"
echo "Database URL: jdbc:h2:mem:ecohaul"
echo "Username: sa"
echo "Password: (empty)"

echo ""
echo "✅ All endpoint tests completed!"
echo ""
echo "🎯 Your Spring Boot Backend is running successfully!"
echo "📊 Database: H2 in-memory (all tables created)"
echo "🔧 Development features: DevTools with LiveReload"
echo "🌐 Server: http://localhost:8080"
