#!/bin/bash
BASE_URL="http://localhost:3000"

echo "🧪 4S GHOST ENTERPRISE API TEST SUITE"
echo "======================================"
echo ""

# Test 1: Health Check
echo "📊 TEST 1: Health Check"
HEALTH=$(curl -s "$BASE_URL/health")
echo "Response: $HEALTH"
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "✅ PASSED: Server healthy"
else
  echo "❌ FAILED: Server not healthy"
fi
echo ""

# Test 2: API Info
echo "📖 TEST 2: API Info"
API=$(curl -s "$BASE_URL/api")
echo "Response: $API"
if echo "$API" | grep -q '"name":"4S Ghost Enterprise API"'; then
  echo "✅ PASSED: API info correct"
else
  echo "❌ FAILED: API info wrong"
fi
echo ""

# Test 3: Register User
echo "👤 TEST 3: Register User"
EMAIL="test$(date +%s)@dreamos.dev"
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"test123\",\"name\":\"Test User\"}")
echo "Email: $EMAIL"
echo "Response: $REGISTER"
if echo "$REGISTER" | grep -q '"message":"User registered"'; then
  echo "✅ PASSED: User registered"
else
  echo "❌ FAILED: Registration failed"
fi
echo ""

# Test 4: Login
echo "🔐 TEST 4: Login"
LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"test123\"}")
echo "Response (truncated): ${LOGIN:0:200}..."
if echo "$LOGIN" | grep -q '"accessToken"'; then
  TOKEN=$(echo "$LOGIN" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
  echo "✅ PASSED: Login successful"
  echo "Token: ${TOKEN:0:50}..."
else
  echo "❌ FAILED: Login failed"
  exit 1
fi
echo ""

# Test 5: Get Current User (dengan token)
echo "👁️ TEST 5: Get Current User (Auth Required)"
ME=$(curl -s "$BASE_URL/api/auth/me" -H "Authorization: Bearer $TOKEN")
echo "Response: $ME"
if echo "$ME" | grep -q "\"email\":\"$EMAIL\""; then
  echo "✅ PASSED: Auth working"
else
  echo "❌ FAILED: Auth not working"
fi
echo ""

# Test 6: Verify database file
echo "🗄️ TEST 6: Database File"
if [ -f "data/app.db" ]; then
  SIZE=$(ls -lh data/app.db | awk '{print $5}')
  echo "✅ PASSED: Database exists ($SIZE)"
else
  echo "❌ FAILED: Database not created"
fi
echo ""

echo "======================================"
echo "🎉 ALL TESTS COMPLETED!"
