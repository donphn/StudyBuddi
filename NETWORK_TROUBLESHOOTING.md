# Network Troubleshooting Guide

Your friend's Mac can't connect to your server while other computers can. Here's how to diagnose the issue.

---

## Step 1: Verify Server is Running

On **your computer** (where server is running):

```bash
npm run dev
```

Check that you see output like:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:3000/
➜  Network: http://[YOUR_IP]:3000/
```

Make sure both the frontend and backend are running.

---

## Step 2: Get Your IP Address

On **your computer**:

**Windows (PowerShell):**
```powershell
ipconfig
```

Look for "IPv4 Address" under your active connection. Example: `192.168.1.100`

---

## Step 3: Test from His Mac

On **his Mac**, open Terminal and run:

```bash
# Replace 192.168.1.100 with YOUR actual IP
ping 192.168.1.100
```

**Expected output:**
```
PING 192.168.1.100 (192.168.1.100): 56 data bytes
64 bytes from 192.168.1.100: icmp_seq=0 ttl=64 time=5.123 ms
```

**If ping fails:** His Mac can't reach your computer at all.
- Check: Is he on the same WiFi network?
- Check: Are there two different WiFi networks (2.4GHz vs 5GHz)?
- Try: Both networks, or connect to the same one

---

## Step 4: Test Backend Port

On **his Mac**, run:

```bash
# Test if backend is reachable (port 5000)
curl -v http://192.168.1.100:5000/

# Test if frontend is reachable (port 3000)
curl -v http://192.168.1.100:3000/
```

**Good response:**
```
< HTTP/1.1 200 OK
```

**Bad response (Connection refused):**
- Your firewall is blocking the ports
- The server isn't actually running
- Wrong IP address

---

## Step 5: Check Your Windows Firewall

On **your Windows computer**:

**Quick test:** Temporarily disable firewall
```powershell
# Disable Windows Defender Firewall (Run as Administrator in PowerShell)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $false
```

Then have him try connecting again.

**If it works:** You need to add exceptions to the firewall
```powershell
# Add Node.js to firewall exceptions
netsh advfirewall firewall add rule name="Allow Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

**To re-enable firewall:**
```powershell
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $true
```

---

## Step 6: Check His Mac's Network Settings

On **his Mac**:

```bash
# Check his IP address
ifconfig | grep "inet " | grep -v "127.0.0.1"

# Check his network gateway
netstat -rn | grep default
```

**Problem:** If he's on a different subnet than you, he can't connect.

Example:
- Your IP: `192.168.1.100` (subnet 192.168.1.x)
- His IP: `192.168.2.50` (subnet 192.168.2.x)
- **Result:** Can't connect

**Solution:** Make sure both are on same WiFi network

---

## Step 7: Test DNS Resolution

On **his Mac**:

```bash
# Resolve your computer's hostname (if you have one)
nslookup 192.168.1.100

# Or just try accessing directly
curl http://192.168.1.100:3000
```

---

## Step 8: Check for Proxy/VPN

On **his Mac**:

1. System Preferences → Network → Advanced → Proxies
   - Make sure no proxy is set
2. Check if he's using a VPN
   - Disable it and try again
3. Check if the WiFi requires a portal login
   - Sometimes corporate WiFi blocks peer connections

---

## Quick Diagnostic Checklist

### For Your Computer:
- [ ] `npm run dev` is running (both frontend and backend)
- [ ] Get IP address from `ipconfig`
- [ ] Firewall allows ports 3000 and 5000
- [ ] No proxy/VPN active

### For His Mac:
- [ ] Connected to **same WiFi network** as you
- [ ] `ping 192.168.x.x` succeeds (replace with your IP)
- [ ] `curl http://192.168.x.x:3000/` shows HTML response
- [ ] No proxy blocking connections
- [ ] No VPN active

---

## If All Tests Pass But Browser Still Can't Connect

The browser might need a full cache clear:

**On his Mac in Chrome:**
1. Press `Cmd+Shift+Delete` (opens Clear Browsing Data)
2. Select "All time"
3. Check: Cookies, Cached images and files
4. Click "Clear data"
5. Try accessing the URL again

---

## Most Common Causes

1. **Different WiFi networks** (2.4GHz vs 5GHz, guest network, etc.)
   - Solution: Connect to the exact same network

2. **Windows Firewall blocking** (ports 3000/5000)
   - Solution: Add Node.js exceptions or temporarily disable

3. **Server not running**
   - Solution: Verify `npm run dev` is actually running both services

4. **Wrong IP address being used**
   - Solution: Double-check `ipconfig` output

5. **Corporate/restricted WiFi**
   - Solution: Try on home WiFi instead

---

## Testing Both Services Separately

If one service works but not the other:

**Test backend only:**
```bash
# On his Mac
curl http://192.168.1.100:5000/

# Should see: {"message":"Welcome to StudyBuddi API"}
```

**Test frontend only:**
```bash
# On his Mac
curl http://192.168.1.100:3000/

# Should see HTML response starting with <!DOCTYPE html>
```

If backend works but frontend doesn't:
- Frontend might need to know the IP for API calls
- Check `.env.local` file has correct `VITE_API_URL`

---

## Contact Points for Help

If issue persists after all checks:
1. Run all diagnostic commands and share output
2. Confirm both computers are on same WiFi
3. Share exact error message from browser (F12 → Console)
4. Confirm `npm run dev` is running on your machine
