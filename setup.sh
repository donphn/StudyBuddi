#!/bin/bash

# StudyBuddi Setup Script
# This script helps set up the development environment for new contributors

echo "======================================"
echo "  StudyBuddi Development Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version) found${NC}"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL is not installed or not in PATH${NC}"
    echo "Please install MySQL:"
    echo "  macOS: brew install mysql"
    echo "  Ubuntu: sudo apt install mysql-server"
    echo "  Windows: Download from https://dev.mysql.com/downloads/installer/"
else
    echo -e "${GREEN}✓ MySQL found${NC}"
fi

echo ""
echo "======================================"
echo "Installing dependencies..."
echo "======================================"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed successfully${NC}"

echo ""
echo "======================================"
echo "Setting up environment variables..."
echo "======================================"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your MySQL credentials${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
fi

echo ""
echo "======================================"
echo "Database Setup"
echo "======================================"
echo "To set up the database, run the following command:"
echo -e "${YELLOW}mysql -u root -p < server/models/schema.sql${NC}"
echo ""
echo "Or manually in MySQL:"
echo "  1. mysql -u root -p"
echo "  2. source server/models/schema.sql"
echo ""

echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Update .env with your MySQL credentials"
echo "  2. Create the database: mysql -u root -p < server/models/schema.sql"
echo "  3. Start development: npm run dev"
echo ""
echo "Available commands:"
echo "  npm run dev     - Start both frontend and backend"
echo "  npm run client  - Start only frontend (port 3000)"
echo "  npm run server  - Start only backend (port 5000)"
echo "  npm run build   - Build for production"
echo ""
echo -e "${GREEN}Happy coding!${NC}"
