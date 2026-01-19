import { fetchAllItems } from '#src/controllers/item.controller.js';
import express from 'express';

const itemRouter = express.Router();

itemRouter.get('/', fetchAllItems);

export default itemRouter;
