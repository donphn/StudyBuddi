import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'studybuddi',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool for async/await
const promisePool = pool.promise();

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('Please check your .env file and ensure MySQL is running');
  }
};

// Execute query helper function
export const query = async (sql, params) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default promisePool;
