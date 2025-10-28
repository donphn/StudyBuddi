# StudyBuddi Backend API

RESTful API server for StudyBuddi built with Express.js and MySQL.

## Setup Instructions

### 1. Install MySQL

Make sure MySQL is installed and running on your system:

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download from https://dev.mysql.com/downloads/installer/

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

Run the SQL schema file to set up your database:

```bash
mysql -u root -p < server/models/schema.sql
```

Or manually in MySQL:
```bash
mysql -u root -p
source server/models/schema.sql
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your settings:

```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studybuddi
DB_PORT=3306
```

### 4. Run the Application

**Start both frontend and backend:**
```bash
npm run dev
```

**Run only the backend server:**
```bash
npm run server
```

**Run only the frontend:**
```bash
npm run client
```

## API Endpoints

### Base URL
`http://localhost:5000/api`

### Example Endpoints

#### Get all items
```http
GET /api/examples
```

#### Get single item
```http
GET /api/examples/:id
```

#### Create new item
```http
POST /api/examples
Content-Type: application/json

{
  "name": "Item Name",
  "description": "Item Description"
}
```

#### Update item
```http
PUT /api/examples/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

#### Delete item
```http
DELETE /api/examples/:id
```

## Project Structure

```
server/
├── config/
│   └── database.js       # MySQL connection configuration
├── controllers/
│   └── exampleController.js  # Request handlers
├── routes/
│   └── exampleRoutes.js      # API route definitions
├── models/
│   └── schema.sql            # Database schema
├── middleware/               # Custom middleware (future)
└── server.js                 # Express app entry point
```

## Testing the API

You can test the API using:
- **Postman**: Import the endpoints above
- **cURL**: Command line testing
- **Thunder Client**: VS Code extension

Example cURL request:
```bash
curl http://localhost:5000/api/examples
```

## Database Schema

The initial schema includes:
- `items` - Example table with CRUD operations
- `users` - User authentication table (future)
- `study_sessions` - Study session tracking (future)

Modify `server/models/schema.sql` to customize your database structure.
