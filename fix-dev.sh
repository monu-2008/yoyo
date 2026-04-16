#!/bin/bash
# Race Computer — Dev Server Cleanup & Restart Script
# Run this if website gets stuck on loading or shows HMR module errors

echo "🔧 RACE COMPUTER — Cleaning dev cache..."
echo ""

# Kill any existing dev server
echo "1️⃣  Stopping dev server..."
kill $(lsof -t -i:3000) 2>/dev/null
sleep 2

# Delete all caches
echo "2️⃣  Deleting .next cache..."
rm -rf .next

echo "3️⃣  Deleting node_modules cache..."
rm -rf node_modules/.cache

# Restart
echo "4️⃣  Starting fresh dev server..."
node node_modules/.bin/next dev -p 3000 &

sleep 8
echo ""
echo "✅ Dev server restarted! Open http://localhost:3000"
echo ""
echo "💡 If still stuck, run: kill -9 \$(lsof -t -i:3000) && rm -rf .next node_modules/.cache && node node_modules/.bin/next dev -p 3000"
