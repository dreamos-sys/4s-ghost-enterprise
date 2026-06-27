#!/bin/bash

cd ~/4s-ghost-enterprise

echo "╔════════════════════════════════════════════╗"
echo "║   🤖 DREAMS ENTERPRISE SYSTEM v1.0        ║"
echo "║   Starting Local Development Server...     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Kill proses lama
pkill -f "node src/index.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# Start backend
echo "🔧 [BACKEND] Starting on port 3001..."
cd backend
npm install --silent
PORT=3001 node src/index.js &
BACKEND_PID=$!
cd ..

sleep 2

# Start frontend
echo "🎨 [FRONTEND] Starting on port 5173..."
cd frontend
npm install --silent
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ ALL SYSTEMS OPERATIONAL              ║"
echo "║   🔹 Backend:  http://localhost:3001      ║"
echo "║   🔹 Frontend: http://localhost:5173      ║"
echo "║   Press Ctrl+C to stop                    ║"
echo "╚════════════════════════════════════════════╝"

wait
