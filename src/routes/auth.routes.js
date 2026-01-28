import { signup, signin, signout, getRefineMeData } from '#controllers/auth.controller.js';
import { authenticateToken } from '#middleware/auth.middleware.js';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/sign-up', signup);
authRouter.post('/sign-in', signin);
authRouter.post('/sign-out', signout);
authRouter.get('/me', authenticateToken, getRefineMeData);

export default authRouter;
