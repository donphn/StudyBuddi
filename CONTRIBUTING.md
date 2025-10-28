# Contributing to StudyBuddi

Thank you for your interest in contributing to StudyBuddi! This document provides guidelines and instructions for contributors.

## Getting Started

### First Time Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/StudyBuddi.git
cd StudyBuddi
```

2. **Run the setup script**

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

3. **Configure your environment**
- Edit `.env` with your MySQL credentials
- Create the database: `mysql -u root -p < server/models/schema.sql`

4. **Start development**
```bash
npm run dev
```

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/user-authentication`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation changes (e.g., `docs/api-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/database-connection`)

### Making Changes

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

3. **Test your changes**
```bash
# Run linting
npm run lint

# Test frontend
npm run client

# Test backend
npm run server

# Test both together
npm run dev
```

4. **Commit your changes**
```bash
git add .
git commit -m "Add feature: description of your changes"
```

Follow these commit message guidelines:
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template with:
  - Description of changes
  - Related issues
  - Testing done
  - Screenshots (if applicable)

## Code Style Guidelines

### JavaScript/React

- Use ES6+ features (arrow functions, destructuring, etc.)
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

Example:
```javascript
/**
 * Fetches user data from the API
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise<Object>} User data object
 */
const fetchUser = async (userId) => {
  // Implementation
}
```

### API Development

- Follow RESTful conventions
- Use proper HTTP status codes
- Include error handling
- Validate input data
- Use async/await for database operations

Example:
```javascript
export const createItem = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    // Database operation
    const result = await query(/* ... */);

    // Success response
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
```

### Database

- Use parameterized queries to prevent SQL injection
- Follow naming conventions (snake_case for columns)
- Add indexes for frequently queried columns
- Document schema changes

## Testing

### Manual Testing

1. **Frontend Testing**
   - Test UI in different browsers (Chrome, Firefox, Safari)
   - Check responsive design on mobile/tablet
   - Verify all user interactions work correctly

2. **Backend Testing**
   - Test API endpoints using Postman or curl
   - Verify error handling
   - Check database operations

3. **Integration Testing**
   - Test frontend-backend communication
   - Verify data flow through the application

### Example API Test

```bash
# Create an item
curl -X POST http://localhost:5000/api/examples \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Test Description"}'

# Get all items
curl http://localhost:5000/api/examples

# Get single item
curl http://localhost:5000/api/examples/1

# Update item
curl -X PUT http://localhost:5000/api/examples/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","description":"Updated Description"}'

# Delete item
curl -X DELETE http://localhost:5000/api/examples/1
```

## Common Issues and Solutions

### Database Connection Issues

```javascript
// Make sure MySQL is running
brew services start mysql  // macOS
sudo systemctl start mysql // Linux

// Check connection
mysql -u root -p
```

### Port Conflicts

```bash
# Check what's using a port
lsof -i :3000  # Frontend port
lsof -i :5000  # Backend port

# Kill the process
kill -9 <PID>
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] No ESLint warnings/errors
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear
- [ ] PR description explains changes
- [ ] Related issues are referenced
- [ ] Screenshots added (for UI changes)

## Questions or Need Help?

- Open an issue on GitHub
- Check existing issues for similar questions
- Review the [README.md](README.md) for setup help

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions professional

Thank you for contributing to StudyBuddi!
