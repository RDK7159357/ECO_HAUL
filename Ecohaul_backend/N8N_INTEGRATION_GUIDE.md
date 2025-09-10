# n8n Workflow Examples for EcoHaul Backend

## 1. User Registration & Welcome Flow
```
Webhook Trigger (New User) 
→ HTTP Request (POST /api/v1/users/register)
→ Condition (Registration Success?)
  ├─ True: Send Welcome Email
  └─ False: Send Error Notification

Example HTTP Request Node Configuration:
- Method: POST
- URL: http://localhost:8080/api/v1/users/register
- Body: JSON
  {
    "email": "{{$json.email}}",
    "password": "{{$json.password}}",
    "fullName": "{{$json.fullName}}",
    "phoneNumber": "{{$json.phoneNumber}}"
  }
```

## 2. Waste Scanning Automation
```
Webhook (Image Upload)
→ HTTP Request (POST /api/v1/waste-scanner/scan)
→ Condition (Confidence > 0.8?)
  ├─ True: Add to Cart Automatically
  └─ False: Send Manual Review Alert

Example Configuration:
- URL: http://localhost:8080/api/v1/waste-scanner/scan
- Body: {"imageBase64": "{{$json.image}}"}
```

## 3. Pickup Scheduling & Notifications
```
Schedule Trigger (Daily 9 AM)
→ HTTP Request (GET /api/v1/cart/pickups/{userId})
→ Loop (For each pickup)
  → Condition (Pickup Today?)
    ├─ True: Send SMS Reminder
    └─ Continue

Example SMS Message:
"Hi {{$json.userName}}, your EcoHaul pickup is scheduled for {{$json.pickupTime}} today at {{$json.address}}"
```

## 4. Feedback Alert System
```
Webhook (New Feedback)
→ HTTP Request (POST /api/v1/feedback/submit)
→ Condition (Priority = "high"?)
  ├─ True: Immediate Slack Alert
  └─ Email to Support Team

Example Slack Message:
"🚨 High Priority Feedback: {{$json.title}} from {{$json.userEmail}}"
```

## 5. Analytics Dashboard Update
```
Schedule Trigger (Daily)
→ HTTP Request (GET /api/v1/users/stats/{userId})
→ Google Sheets (Update Row)
→ Chart Generation
→ Email Report to Admin

Example Google Sheets Update:
- Total Scans: {{$json.totalScans}}
- Eco Points: {{$json.ecoPoints}}
- CO2 Saved: {{$json.co2Saved}}
```

## 6. Disposal Center Monitoring
```
Schedule Trigger (Hourly)
→ HTTP Request (GET /api/v1/disposal/centers)
→ Loop (For each center)
  → Condition (Rating < 3.0?)
    ├─ True: Send Quality Alert
    └─ Continue

Example Alert:
"⚠️ Disposal Center {{$json.name}} has low rating: {{$json.rating}}/5.0"
```

## 7. Cart Abandonment Recovery
```
Schedule Trigger (Daily)
→ HTTP Request (GET /api/v1/cart/{userId})
→ Condition (Items > 0 AND lastUpdate > 3 days?)
  ├─ True: Send Reminder Email
  └─ Skip

Example Email:
"Don't forget about your {{$json.totalItems}} items waiting for pickup! Schedule now to earn {{$json.estimatedEcoPoints}} eco points."
```

## 8. AI Enhancement Workflow
```
Webhook (Scan Result)
→ OpenAI Node (Enhance Detection)
→ HTTP Request (POST /api/v1/waste-scanner/identify)
→ Database Update
→ User Notification

Example OpenAI Prompt:
"Analyze this waste description: {{$json.description}}. Provide disposal instructions and environmental impact."
```

## Authentication Setup for n8n

1. Get JWT Token:
```
HTTP Request: POST /api/v1/users/login
Body: {"email": "user@example.com", "password": "password"}
Response: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

2. Use Token in Headers:
```
Authorization: Bearer {{$node["Login"].json["token"]}}
Content-Type: application/json
```

## Error Handling in n8n

Your backend returns structured errors that n8n can handle:

```javascript
// Success Response (200)
{
  "message": "Operation successful",
  "data": {...}
}

// Error Response (400/500)
{
  "message": "Error description",
  "error": "details"
}
```

Use n8n's IF node to check:
- `{{$json.message}}` contains "success"
- HTTP status code equals 200
- `{{$json.error}}` is undefined
