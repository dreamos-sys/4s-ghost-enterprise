#!/bin/bash

echo "🍯 Simulating multi-attacker scenario..."

# Attacker 1: SQL injection specialist
for i in {1..5}; do
  curl -s "http://localhost:3001/honeypot/admin?id=$i' OR '1'='1" -H "X-Forwarded-For: 192.168.1.100" > /dev/null
  sleep 0.5
done

# Attacker 2: XSS hunter
for i in {1..3}; do
  curl -s "http://localhost:3001/honeypot/comment?text=<script>alert($i)</script>" -H "X-Forwarded-For: 10.0.0.50" > /dev/null
  sleep 0.5
done

# Attacker 3: Directory traversal expert
for i in {1..4}; do
  curl -s "http://localhost:3001/honeypot/file?path=../../../etc/passwd$i" -H "X-Forwarded-For: 172.16.0.25" > /dev/null
  sleep 0.5
done

# Attacker 4: Scanner bot
for endpoint in "wp-admin" "phpmyadmin" ".env" "backup.sql" "shell.php"; do
  curl -s "http://localhost:3001/honeypot/$endpoint" -H "X-Forwarded-For: 203.0.113.42" -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1)" > /dev/null
  sleep 0.5
done

echo "✅ Simulation complete!"
