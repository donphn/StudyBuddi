import { query } from '../config/database.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, user_id, username, content, created_at FROM messages ORDER BY created_at ASC LIMIT 50'
    );

    res.json({
      success: true,
      messages: result
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { user_id, username, content } = req.body;

    if (!user_id || !username || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: user_id, username, content'
      });
    }

    // Insert message into database
    await query(
      'INSERT INTO messages (user_id, username, content) VALUES (?, ?, ?)',
      [user_id, username, content]
    );

    // Get the newly created message
    const result = await query(
      'SELECT id, user_id, username, content, created_at FROM messages ORDER BY created_at DESC LIMIT 1'
    );

    const newMessage = result[0];

    // Emit the new message to all connected clients via Socket.IO
    const io = req.app.get('io');
    io.emit('newMessage', newMessage);

    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
};
