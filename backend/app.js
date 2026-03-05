// App.js for
// routes , middleware here and database logic here

import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middlwares/globalErrorHandler.middleware.js';
import AuthRouter from './routes/auth.routes.js';

// app
const app=express();

// connect db
connectDb()


// middleware
app.use(cors());
app.use(express.json());

// =======================
// Routes
// =======================

app.use('/api/auth',AuthRouter);
// test route

app.get('/',(req,res,next)=>{
    res.send('Api is working');
    next()  
})

// global error handler
app.use(globalErrorHandler);

export default app;