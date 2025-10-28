import { query } from '../config/database.js';

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await query('SELECT * FROM items');
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items'
    });
  }
};

// Get single item by ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await query('SELECT * FROM items WHERE id = ?', [id]);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: items[0]
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item'
    });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const result = await query(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        description
      }
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create item'
    });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await query(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: { id, name, description }
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update item'
    });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'
    });
  }
};
