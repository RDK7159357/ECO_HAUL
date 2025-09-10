#!/bin/bash

# EcoHaul Backend API Testing Script
# This script tests all the major endpoints of the EcoHaul backend

BASE_URL="http://localhost:8080"
echo "🌱 Testing EcoHaul Backend API at $BASE_URL"
echo "================================================"

# Function to make HTTP requests and display results
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo
    echo "🔍 Testing: $description"
    echo "📍 $method $endpoint"
    
    if [ -n "$data" ]; then
        echo "📤 Request Data: $data"
        response=$(curl -s -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint")
    fi
    
    echo "📥 Response:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo "---"
}

# 1. Health Check
test_endpoint "GET" "/api/v1/health" "" "Health Check Endpoint"

# 2. User Registration
test_endpoint "POST" "/api/v1/users/register" '{
    "email": "testuser@ecohaul.com",
    "password": "password123",
    "fullName": "Test User",
    "phoneNumber": "+1-555-0123"
}' "User Registration"

# 3. User Login
test_endpoint "POST" "/api/v1/users/login" '{
    "email": "test@example.com",
    "password": "password123"
}' "User Login (with valid credentials)"

# 4. User Profile
test_endpoint "GET" "/api/v1/users/profile/user-123" "" "Get User Profile"

# 5. User Stats
test_endpoint "GET" "/api/v1/users/stats/user-123" "" "Get User Statistics"

# 6. Waste Scanner - Scan Image
test_endpoint "POST" "/api/v1/waste-scanner/scan" '{
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
}' "Waste Scanner - Image Analysis"

# 7. Waste Scanner - Identify by Description
test_endpoint "POST" "/api/v1/waste-scanner/identify" '{
    "description": "plastic water bottle"
}' "Waste Scanner - Identify by Description"

# 8. Waste Scanner - Get Supported Types
test_endpoint "GET" "/api/v1/waste-scanner/waste-types" "" "Get Supported Waste Types"

# 9. Waste Scanner - Scan History
test_endpoint "GET" "/api/v1/waste-scanner/history/123" "" "Get User Scan History"

# 10. Cart Operations - Get Cart
test_endpoint "GET" "/api/v1/cart/user/123" "" "Get User Cart"

# 11. Cart Operations - Add Item
test_endpoint "POST" "/api/v1/cart/add" '{
    "userId": 123,
    "wasteType": "Plastic Bottle",
    "category": "Recyclable",
    "quantity": 2,
    "weight": 0.5,
    "pickupPreference": "SCHEDULED"
}' "Add Item to Cart"

# 12. Disposal Centers
test_endpoint "GET" "/api/v1/disposal/centers" "" "Get Disposal Centers"

# 13. Disposal Agents
test_endpoint "GET" "/api/v1/disposal/agents" "" "Get Available Disposal Agents"

# 14. Disposal Instructions
test_endpoint "GET" "/api/v1/disposal/instructions/Plastic%20Bottle" "" "Get Disposal Instructions for Plastic Bottle"

# 15. Submit Feedback
test_endpoint "POST" "/api/v1/feedback/submit" '{
    "userId": 123,
    "type": "BUG_REPORT",
    "title": "Scanner Issue",
    "message": "The scanner is not detecting glass bottles correctly",
    "category": "TECHNICAL"
}' "Submit User Feedback"

# 16. Get User Feedback
test_endpoint "GET" "/api/v1/feedback/user/123" "" "Get User Feedback History"

# 17. N8N Bridge Health Check
test_endpoint "GET" "/api/v1/n8n/health" "" "N8N Bridge Health Check"

# 18. Data Provider - Get All Data
test_endpoint "GET" "/api/v1/data" "" "Data Provider - Get All Data"

echo
echo "🎉 Backend API Testing Complete!"
echo "================================================"
echo "✅ If you see JSON responses above, your backend is working correctly!"
echo "❌ If you see HTML error pages, there might be endpoint mapping issues."
echo
echo "🔧 Next Steps:"
echo "1. Check which endpoints returned successful responses"
echo "2. Verify any endpoints that returned 404 errors"
echo "3. Test with different data payloads as needed"
echo
