# Contributor Setup - StudyBuddi

Welcome to the StudyBuddi project! This guide makes it super easy for you (and your friend) to set up the project locally.

## For Your Friend (or Any New Contributor)

### Step 1: Clone the Repository

```bash
git clone https://github.com/donphn/StudyBuddi.git
cd StudyBuddi
```

### Step 2: Run Setup Script

**On Windows:**
```bash
setup.bat
```

**On Mac/Linux:**
```bash
./setup.sh
```

This automatically:
- ✅ Checks if Node.js, npm, and MySQL are installed
- ✅ Installs all dependencies (including `jsonwebtoken`, `react-router-dom`, etc.)
- ✅ Creates `.env` file from `.env.example`
- ✅ Shows instructions for the next steps

### Step 3: Configure Database

The setup script will tell you to run:

```bash
mysql -u root -p < server/models/schema.sql
```

When prompted, enter your MySQL root password.

### Step 4: Update Environment Variables

Edit `.env` file with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studybuddi
DB_PORT=3306
VITE_API_URL=http://localhost:5000
```

### Step 5: Start Developing!

```bash
npm run dev
```

Then open: **http://localhost:3000**

You should see the **Login Page**. Create an account and start using the app!

---

## For Multi-Device Testing (Network)

To test on multiple devices (phone, tablet, other computer):

### Get Your IP Address

**Windows:**
```bash
ipconfig
```

Look for "IPv4 Address" (usually `192.168.x.x` or `10.x.x.x`)

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Create `.env.local`

```bash
cp .env.local.example .env.local
```

Edit and add your IP:
```
VITE_API_URL=http://YOUR_IP_ADDRESS:5000
```

Example:
```
VITE_API_URL=http://192.168.1.100:5000
```

### Access from Other Device

On another device on the same WiFi:

```
http://YOUR_IP_ADDRESS:3000
```

---

## What Was Installed?

When you run `setup.bat` or `setup.sh`, these packages are installed:

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "mysql2": "^3.15.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1",
    "jsonwebtoken": "^10.1.0",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.0",
    "vite": "^7.1.12",
    "nodemon": "^3.1.10",
    "concurrently": "^9.2.1",
    "eslint": "^9.38.0"
  }
}
```

---

## Available Commands After Setup

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Check code quality
npm run lint

# Create/recreate database
npm run db:create
```

---

## Features

✅ **Authentication System**
- Login & Signup pages
- JWT token-based sessions
- Protected routes
- User accounts stored in MySQL

✅ **Real-Time Communication**
- Socket.IO for live updates
- Two independent counters with real-time sync
- Cross-device synchronization

✅ **Database**
- MySQL with user management
- Tables for users, counters, items, and study sessions

✅ **Modern Development**
- React 19 with React Router
- Vite for fast builds
- Hot Module Replacement (HMR)
- Express.js backend
- Automatic server restart with Nodemon

---

## Project Structure

```
StudyBuddi/
├── src/                           # Frontend (React)
│   ├── pages/
│   │   ├── LoginPage.jsx          # Login form
│   │   ├── SignUpPage.jsx         # Registration form
│   │   └── CounterPage.jsx        # Main app with counters
│   ├── components/
│   │   └── ProtectedRoute.jsx     # Auth guard for routes
│   ├── styles/
│   │   └── AuthPages.css          # Login/signup styling
│   ├── App.jsx                    # Router setup
│   └── main.jsx                   # Entry point
│
├── server/                        # Backend (Node.js)
│   ├── routes/
│   │   ├── userRoutes.js          # Login/signup endpoints
│   │   ├── counterRoutes.js       # Counter endpoints
│   │   └── exampleRoutes.js       # Example CRUD endpoints
│   ├── controllers/
│   │   ├── userController.js      # Auth logic
│   │   ├── counterController.js   # Counter logic
│   │   └── exampleController.js   # Example logic
│   ├── config/
│   │   └── database.js            # MySQL connection
│   ├── models/
│   │   └── schema.sql             # Database schema
│   └── server.js                  # Express app
│
├── .env                           # Your local config (don't commit)
├── .env.example                   # Template for .env
├── .env.local.example             # Template for network testing
├── setup.bat                      # Windows setup script
├── setup.sh                       # Mac/Linux setup script
├── SETUP_GUIDE.md                 # Detailed setup instructions
├── CONTRIBUTOR_SETUP.md           # This file
├── package.json                   # Dependencies list
└── vite.config.js                 # Frontend build config
```

---

## Troubleshooting

### Setup script fails

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
Make sure you're using Command Prompt (not PowerShell), or right-click and "Run as Administrator"

### MySQL connection error

1. Make sure MySQL is running:
   - **Windows**: Check Services or run `mysqld` in admin terminal
   - **Mac**: `brew services start mysql`
   - **Linux**: `sudo systemctl start mysql`

2. Verify credentials in `.env`:
   ```
   DB_USER=root
   DB_PASSWORD=your_actual_password
   ```

### Port already in use

If port 3000 or 5000 is already in use:

1. Find what's using it:
   - **Windows**: `netstat -ano | findstr :3000`
   - **Mac/Linux**: `lsof -i :3000`

2. Stop that process or change ports in `.env`:
   ```
   PORT=5001
   ```

### Can't access from another device

1. Make sure both devices are on **same WiFi network**
2. Create `.env.local` with your IP address
3. Check firewall isn't blocking ports 3000/5000
4. Verify your IP is correct: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

---

## Next Steps

1. ✅ Run `setup.bat` or `setup.sh`
2. ✅ Configure `.env` with MySQL credentials
3. ✅ Run `npm run dev`
4. ✅ Open http://localhost:3000
5. ✅ Create a test account
6. ✅ Test the counter buttons
7. 💻 Start coding!

---

## Questions?

Check these files for more help:
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup guide
- **[README.md](README.md)** - Project overview
- **[server/README.md](server/README.md)** - API documentation

---

Happy coding! 🚀
