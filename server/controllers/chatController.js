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

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user_id } = req.body;

    if (!messageId || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: messageId, user_id'
      });
    }

    // Check if the message exists and belongs to the user
    const messageResult = await query(
      'SELECT id, user_id FROM messages WHERE id = ?',
      [messageId]
    );

    if (messageResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if the user is the message owner
    if (messageResult[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own messages'
      });
    }

    // Delete the message
    await query(
      'DELETE FROM messages WHERE id = ?',
      [messageId]
    );

    // Emit deletion event to all connected clients via Socket.IO
    const io = req.app.get('io');
    io.emit('messageDeleted', {
      messageId: parseInt(messageId)
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
};
