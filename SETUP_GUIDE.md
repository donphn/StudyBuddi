# StudyBuddi Setup Guide

Welcome! This guide will help you set up StudyBuddi for development.

## Prerequisites

Before starting, make sure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **MySQL Server** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/installer/)

### Verify Prerequisites

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MySQL
mysql --version
```

---

## Quick Setup (Automated)

### Windows
```bash
./setup.bat
```

### Mac/Linux
```bash
./setup.sh
```

This will automatically:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Create `.env` file from `.env.example`
- ✅ Show next steps

---

## Manual Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages:
- Express (backend)
- React (frontend)
- Socket.IO (real-time communication)
- MySQL2 (database driver)
- JWT (authentication)
- React Router (page routing)

### Step 2: Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` and update with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studybuddi
DB_PORT=3306
VITE_API_URL=http://localhost:5000
```

### Step 3: Create Database

```bash
mysql -u root -p < server/models/schema.sql
```

When prompted, enter your MySQL password.

Or manually in MySQL:
```sql
mysql -u root -p
source server/models/schema.sql;
```

### Step 4: Start Development

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## Multi-Device Testing

To test on multiple devices (phone, tablet, another computer):

### Step 1: Get Your IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (usually `192.168.x.x` or `10.x.x.x`)

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Create `.env.local`

Copy the example:
```bash
cp .env.local.example .env.local
```

Edit and update with your IP:
```
VITE_API_URL=http://YOUR_IP_ADDRESS:5000
```

Example:
```
VITE_API_URL=http://192.168.1.100:5000
```

### Step 3: Start Server

```bash
npm run dev
```

### Step 4: Access from Other Device

On another device (same WiFi network), open:
```
http://YOUR_IP_ADDRESS:3000
```

---

## Available Commands

```bash
# Start both frontend and backend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
npm run build

# Run linter
npm run lint

# Create database
npm run db:create
```

---

## Project Structure

```
StudyBuddi/
├── src/                    # Frontend (React)
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   └── CounterPage.jsx
│   ├── components/         # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── styles/             # CSS files
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
│
├── server/                 # Backend (Node.js/Express)
│   ├── routes/             # API routes
│   │   ├── userRoutes.js   # Login/signup
│   │   ├── counterRoutes.js
│   │   └── exampleRoutes.js
│   ├── controllers/        # Business logic
│   │   ├── userRoutes.js
│   │   ├── counterController.js
│   │   └── exampleController.js
│   ├── config/             # Configuration
│   │   └── database.js     # MySQL connection
│   ├── models/             # Database schema
│   │   └── schema.sql
│   └── server.js           # Express app
│
├── .env                    # Environment variables (local)
├── .env.example            # Environment template
├── .env.local.example      # Local override example
├── setup.bat               # Windows setup script
├── setup.sh                # Mac/Linux setup script
└── package.json            # Dependencies
```

---

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Change port in .env
PORT=5001
```

### MySQL Connection Error

Make sure MySQL is running:

**Windows:**
```bash
mysql -u root -p
```

**Mac (Homebrew):**
```bash
brew services start mysql
```

### Frontend Can't Connect to Backend

1. Check `.env.local` is created and has correct IP
2. Make sure both devices are on same WiFi network
3. Check firewall isn't blocking ports 3000/5000
4. Verify backend is running: `npm run server`

### Database Schema Error

Recreate the database:

```bash
mysql -u root -p -e "DROP DATABASE studybuddi;"
mysql -u root -p < server/models/schema.sql
```

---

## Features

✅ **Authentication**
- Login/Signup with JWT tokens
- Protected routes
- Session persistence

✅ **Real-time Communication**
- Socket.IO for live updates
- Multiple independent counters
- Cross-device synchronization

✅ **Database**
- MySQL with connection pooling
- User management
- Counter storage

✅ **Development**
- Hot Module Replacement (HMR)
- Automatic server restart (Nodemon)
- ESLint for code quality

---

## Next Steps

1. ✅ Complete setup following this guide
2. 📝 Create a test account
3. 🧪 Test the counter buttons
4. 📱 Open on multiple devices and see real-time sync
5. 💻 Start building your features!

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs: `npm run server`
3. Open browser DevTools: F12 → Console
4. Check `.env` file has correct values

---

Happy coding! 🚀
