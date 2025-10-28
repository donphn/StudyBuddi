# Network Setup for Multi-Device Testing

## Your Local IP Address
**`10.21.145.113`**

## How to Test on Two Computers

### Computer 1 (This Computer - Server Host)

1. **Start both servers:**
```bash
npm run dev
```

2. **Access the app:**
- Frontend: http://localhost:3000
- Or: http://10.21.145.113:3000

### Computer 2 (Testing Device)

1. **Make sure both computers are on the same WiFi network**

2. **Update the Socket.IO connection in App.jsx:**

   On Computer 2, edit `src/App.jsx` line 6:
   ```javascript
   // Change from:
   const socket = io('http://localhost:5001')

   // To:
   const socket = io('http://10.21.145.113:5001')
   ```

   Also update the API fetch calls (lines 14, 50, 68):
   ```javascript
   // Change from:
   fetch('http://localhost:5001/api/counter')

   // To:
   fetch('http://10.21.145.113:5001/api/counter')
   ```

3. **Access the app on Computer 2:**
   - Frontend: http://10.21.145.113:3000

## Quick Test (Single Computer, Multiple Tabs)

You can test this immediately on one computer:

1. Start servers: `npm run dev`
2. Open http://localhost:3000 in Chrome
3. Open http://localhost:3000 in another tab or Firefox
4. Click the counter button in either tab
5. Watch the counter update in BOTH tabs in real-time!

## How It Works

```
Computer A          →  Server (10.21.145.113:5001)  ←  Computer B
  ↓ Click button              ↓                            ↓
  ↓ POST /increment          Database                     Receives
  ↓                           Updated                      Socket.IO
  ↓                              ↓                         Event
  ↓ ← Socket.IO broadcasts to all clients →               ↓
  ↓ Counter updates                          Counter updates
```

1. Any computer clicks "Increment"
2. Frontend sends POST to backend API
3. Backend updates MySQL database
4. Backend broadcasts new count via Socket.IO
5. ALL connected clients receive update instantly
6. All counters update simultaneously

## Troubleshooting

### Computer 2 can't connect:

1. **Check firewall:**
   - Mac: System Settings → Network → Firewall
   - Allow Node.js connections

2. **Verify IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Test connection from Computer 2:**
   ```bash
   ping 10.21.145.113
   curl http://10.21.145.113:5001/api/counter
   ```

### Port conflicts:

- Frontend uses port 3000
- Backend uses port 5001
- Make sure no other apps are using these ports

## Environment Variable for Production

For easier configuration, you can use environment variables:

Create `.env.local` in the project root:
```
VITE_API_URL=http://10.21.145.113:5001
```

Then update `src/App.jsx` to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const socket = io(API_URL)
```
