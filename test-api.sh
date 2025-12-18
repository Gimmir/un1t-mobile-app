#!/bin/bash

# API Testing Script
# Usage: ./test-api.sh

API_URL="https://un1t-back-end-development.up.railway.app"
EMAIL="admin@un1t.com"
PASSWORD="123qwe23"

echo "=========================================="
echo "UN1T API Test Script"
echo "=========================================="
echo ""

# 1. Login and get token
echo "1. 🔐 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq '.' > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Failed to parse login response"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // .token // .data.accessToken // .accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Failed to get token"
  echo "$LOGIN_RESPONSE" | jq '.'
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:30}..."
echo ""

# 2. Get Events
echo "2. 📅 Fetching events..."
EVENTS_RESPONSE=$(curl -s -X GET "$API_URL/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$EVENTS_RESPONSE" | jq '.'
echo ""

# Save to file
echo "$EVENTS_RESPONSE" | jq '.' > events-response.json
echo "✅ Events saved to events-response.json"
echo ""

# 3. Get Studios
echo "3. 🏢 Fetching studios..."
STUDIOS_RESPONSE=$(curl -s -X GET "$API_URL/studios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$STUDIOS_RESPONSE" | jq '.'
echo ""

# Save to file
echo "$STUDIOS_RESPONSE" | jq '.' > studios-response.json
echo "✅ Studios saved to studios-response.json"
echo ""

# 4. Get User Profile
echo "4. 👤 Fetching user profile..."
USER_RESPONSE=$(curl -s -X GET "$API_URL/users/me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Response:"
echo "$USER_RESPONSE" | jq '.'
echo ""

# Save to file
echo "$USER_RESPONSE" | jq '.' > user-response.json
echo "✅ User profile saved to user-response.json"
echo ""

# 5. Get specific event if any exist
EVENT_ID=$(echo "$EVENTS_RESPONSE" | jq -r '.data[0]._id // .data.data[0]._id // empty')

if [ ! -z "$EVENT_ID" ] && [ "$EVENT_ID" != "null" ]; then
  echo "5. 📅 Fetching specific event ($EVENT_ID)..."
  EVENT_DETAIL_RESPONSE=$(curl -s -X GET "$API_URL/events/$EVENT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Response:"
  echo "$EVENT_DETAIL_RESPONSE" | jq '.'
  echo ""
  
  # Save to file
  echo "$EVENT_DETAIL_RESPONSE" | jq '.' > event-detail-response.json
  echo "✅ Event detail saved to event-detail-response.json"
  echo ""
fi

echo "=========================================="
echo "✅ All tests complete!"
echo "=========================================="
echo ""
echo "Files created:"
echo "  - events-response.json"
echo "  - studios-response.json"
echo "  - user-response.json"
echo "  - event-detail-response.json (if event exists)"
echo ""
