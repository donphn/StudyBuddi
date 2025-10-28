import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/exampleController.js';

const router = express.Router();

// GET /api/examples - Get all items
router.get('/', getAllItems);

// GET /api/examples/:id - Get single item
router.get('/:id', getItemById);

// POST /api/examples - Create new item
router.post('/', createItem);

// PUT /api/examples/:id - Update item
router.put('/:id', updateItem);

// DELETE /api/examples/:id - Delete item
router.delete('/:id', deleteItem);

export default router;
