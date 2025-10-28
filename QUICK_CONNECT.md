# Quick Connect Guide for Second Computer

## Your Server IP: `10.21.145.113`

## Option 1: Just Browse (Easiest - No Setup Required)

On the second computer, just open a web browser and go to:

**http://10.21.145.113:3000**

That's it! The shared counter will work immediately.

---

## Option 2: Run Full Development Environment on Computer 2

If you want to develop on Computer 2:

### 1. Clone the repo on Computer 2:
```bash
git clone https://github.com/donphn/StudyBuddi.git
cd StudyBuddi
npm install
```

### 2. Update the API URLs in `src/App.jsx`:

Change these lines:

```javascript
// Line 6 - Socket connection
const socket = io('http://10.21.145.113:5001')

// Line 14 - Initial fetch
fetch('http://10.21.145.113:5001/api/counter')

// Line 50 - Increment
fetch('http://10.21.145.113:5001/api/counter/increment', {

// Line 68 - Reset
fetch('http://10.21.145.113:5001/api/counter/reset', {
```

### 3. Start only the frontend:
```bash
npm run client
```

Now Computer 2's frontend will connect to Computer 1's backend server!

---

## Current Setup

**Computer 1 (Your Mac - 10.21.145.113):**
- Backend: http://10.21.145.113:5001 ✓ Running
- Frontend: http://10.21.145.113:3000 ✓ Running
- MySQL Database: ✓ Running

**Computer 2:**
- Just needs to browse to http://10.21.145.113:3000
- Or run its own frontend pointing to Computer 1's backend

---

## Testing Right Now (Same Computer)

You can test the real-time sync immediately on one computer:

1. Open http://localhost:3000 in Chrome
2. Open http://localhost:3000 in Firefox (or another Chrome tab)
3. Click increment in one browser
4. Watch it update in the other browser instantly!

---

## Troubleshooting

### Computer 2 can't connect?

**Check firewall on Computer 1:**
```bash
# Mac
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

**Test connection from Computer 2:**
```bash
# Ping the server
ping 10.21.145.113

# Test API
curl http://10.21.145.113:5001/api/counter
```

**Check if ports are accessible:**
```bash
# From Computer 2
telnet 10.21.145.113 5001
telnet 10.21.145.113 3000
```

### Get new IP if it changed:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
