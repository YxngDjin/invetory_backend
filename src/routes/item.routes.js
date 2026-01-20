import {
  createItem,
  fetchAllItems,
  fetchItemById,
} from '#src/controllers/item.controller.js';
import express from 'express';

const itemRouter = express.Router();

itemRouter.get('/', fetchAllItems);
itemRouter.post('/', createItem);
itemRouter.get('/:id', fetchItemById);

export default itemRouter;
