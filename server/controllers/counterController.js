import { query } from '../config/database.js';

// Get current counter value
export const getCounter = async (req, res) => {
  try {
    const result = await query('SELECT count FROM shared_counter WHERE id = 1');

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Counter not found'
      });
    }

    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Error fetching counter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch counter'
    });
  }
};

// Increment counter
export const incrementCounter = async (req, res) => {
  try {
    // Increment the counter in database
    await query('UPDATE shared_counter SET count = count + 1 WHERE id = 1');

    // Get the new value
    const result = await query('SELECT count FROM shared_counter WHERE id = 1');
    const newCount = result[0].count;

    // Emit the new count to all connected clients via Socket.IO
    const io = req.app.get('io');
    io.emit('counterUpdate', { count: newCount });

    res.json({
      success: true,
      count: newCount
    });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to increment counter'
    });
  }
};

// Reset counter
export const resetCounter = async (req, res) => {
  try {
    await query('UPDATE shared_counter SET count = 0 WHERE id = 1');

    // Emit the reset to all connected clients
    const io = req.app.get('io');
    io.emit('counterUpdate', { count: 0 });

    res.json({
      success: true,
      count: 0
    });
  } catch (error) {
    console.error('Error resetting counter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset counter'
    });
  }
};
