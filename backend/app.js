// App.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDb from './config/connectDb.js';
import globalErrorHandler from './middlwares/globalErrorHandler.middleware.js';
import AuthRouter from './routes/auth.routes.js';
import ClientRouter from './routes/client.routes.js';
import InvoiceRouter from './routes/invoice.routes.js';

import helmet from 'helmet'
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";

// app
const app = express();

// connect db
connectDb()

// =======================
// Security & Logging
// =======================

app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND,
  credentials: true
}));

// =======================
// Body Parser
// =======================

app.use(express.json());

// =======================
// Security Middlewares
// =======================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api", limiter);
app.use(mongoSanitize());
app.use(hpp());

// =======================
// Routes
// =======================

app.use('/api/auth', AuthRouter);
app.use('/api/client', ClientRouter);
app.use('/api/invoice', InvoiceRouter);

app.get('/', (req,res)=>{
  res.send('API is working');
});

// =======================
// Global Error Handler
// =======================

app.use(globalErrorHandler);

export default app;