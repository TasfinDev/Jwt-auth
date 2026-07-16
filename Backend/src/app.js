import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRouter from '../routes/auth.routes.js';

const app = express();

// Allow requests from your frontend dev server
app.use(cors({
  origin: 'https://jwt-auth-ebon.vercel.app',
  credentials: true,
}));

   app.use(express.json());
   app.use(cookieParser()); 
   app.use(express.urlencoded({ extended: true }));
   app.use(morgan("dev"));
   app.use("/api/routes",authRouter);

 export default app