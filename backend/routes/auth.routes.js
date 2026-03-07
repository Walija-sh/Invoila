import express from 'express';
import { registerUser,loginUser,getMe, updatePassword,updateProfilePhoto,updateCurrency } from '../controllers/auth.controller.js';
import protect from '../middlwares/protect.middleware.js';
import upload from '../middlwares/upload.middleware.js';
const AuthRouter=express.Router();

AuthRouter.post('/register',upload.single('profilePhoto'),registerUser);
AuthRouter.post('/login',loginUser);

AuthRouter.get('/me',protect,getMe);

// update
// Password update
AuthRouter.put('/update-password', protect, updatePassword);
// Profile photo update
AuthRouter.put('/update-profile-photo', protect, upload.single('profilePhoto'), updateProfilePhoto);

AuthRouter.put("/update-currency", protect, updateCurrency);

export default AuthRouter;