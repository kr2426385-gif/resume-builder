import express from 'express';
import { registerUser, loginUser, getUserData, getUserResume } from '../controllers/userController.js';

import { protect } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/resume', protect, getUserResume);

export default userRouter;