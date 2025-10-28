# StudyBuddi

WELCOME!!
This is an open source repository of STUDYBUDDI made by Don Do Phan and Daniel Nguyen.

## What is StudyBuddi?
This is a web app that allows students to connect with peers, similar to Hinge but for finding study partners.

## Tech Stack

**Frontend:**
- React 19.2
- Vite (build tool)
- CSS3

**Backend:**
- Node.js
- Express.js 5.1
- MySQL 2 (mysql2 driver)

**Development Tools:**
- ESLint (code linting)
- Nodemon (auto-restart)
- Concurrently (run multiple processes)

## Quick Start for Contributors

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL (v8.0 or higher)

### Automated Setup

**For macOS/Linux:**
```bash
./setup.sh
```

**For Windows:**
```bash
setup.bat
```

### Manual Setup

1. **Clone the repository**
```bash
git clone https://github.com/donphn/StudyBuddi.git
cd StudyBuddi
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Then edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=studybuddi
DB_PORT=3306
```

4. **Create the database**
```bash
mysql -u root -p < server/models/schema.sql
```

5. **Start the development servers**
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend concurrently |
| `npm run client` | Start only the frontend (Vite dev server) |
| `npm run server` | Start only the backend (Express server) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code quality |

## Project Structure

```
StudyBuddi/
├── src/                    # Frontend React application
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React entry point
│   ├── App.css            # Component styles
│   └── index.css          # Global styles
├── server/                # Backend Express application
│   ├── config/            # Configuration files
│   │   └── database.js    # MySQL connection setup
│   ├── controllers/       # Request handlers
│   │   └── exampleController.js
│   ├── routes/            # API routes
│   │   └── exampleRoutes.js
│   ├── models/            # Database models and schema
│   │   └── schema.sql     # Database schema
│   ├── middleware/        # Custom middleware (future)
│   └── server.js          # Express app entry point
├── public/                # Static assets
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── setup.sh               # Setup script for macOS/Linux
└── setup.bat              # Setup script for Windows
```

## API Documentation

### Base URL
`http://localhost:5000/api`

### Example Endpoints

**Get all items**
```http
GET /api/examples
```

**Get single item**
```http
GET /api/examples/:id
```

**Create new item**
```http
POST /api/examples
Content-Type: application/json

{
  "name": "Item Name",
  "description": "Item Description"
}
```

**Update item**
```http
PUT /api/examples/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

**Delete item**
```http
DELETE /api/examples/:id
```

See [server/README.md](server/README.md) for detailed API documentation.

## Database Schema

The application uses MySQL with the following main tables:
- `items` - Example table with CRUD operations
- `users` - User authentication (planned)
- `study_sessions` - Study session tracking (planned)

See [server/models/schema.sql](server/models/schema.sql) for the complete schema.

## Development Guidelines

1. **Code Style**: Follow ESLint rules configured in the project
2. **Commits**: Write clear, descriptive commit messages
3. **Branches**: Create feature branches from `main`
4. **Pull Requests**: Include description of changes and testing done

## Troubleshooting

### Database connection fails
- Make sure MySQL is running: `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux)
- Check your `.env` file has correct credentials
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port already in use
- Frontend (3000): Stop other Vite/React apps or change port in [vite.config.js](vite.config.js)
- Backend (5000): Stop other Node apps or change `PORT` in `.env`

### Dependencies not installing
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License

## Contact

- Don Do Phan - [GitHub](https://github.com/donphn)
- Daniel Nguyen

Project Link: [https://github.com/donphn/StudyBuddi](https://github.com/donphn/StudyBuddi) 




