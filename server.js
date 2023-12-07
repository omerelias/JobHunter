import 'express-async-errors';
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import mongoose from "mongoose";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {authenticateUser} from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRouter.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if(process.env.NODE_ENV==='development')
{
app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/dist")));

app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});



app.use('/api/v1/jobs',authenticateUser,jobRouter);
app.use('/api/v1/auth',authRouter); 
app.use("/api/v1/users", authenticateUser, userRouter);

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});  

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use('*',(req,res)=>{
    res.status(404).json({msg:'Not Found'}); 
})

app.use(errorHandlerMiddleware);



const port = process.env.PORT || 5100;



try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
  console.log(`server running on port ${port}`);
});  
} catch (error) {
  console.log(error);
  process.exit(1);
}