import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import express from 'express';

const userRouter = express.Router();

userRouter.get('/', authenticateToken, requireRole('admin'), fetchAllUsers);
userRouter.get('/:id', authenticateToken, fetchUserById);
userRouter.put('/:id', authenticateToken, updateUserById);
userRouter.delete('/:id', authenticateToken, requireRole('admin'), deleteUserById);

export default userRouter;