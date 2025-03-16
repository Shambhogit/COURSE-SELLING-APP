import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors'

import courseRoute from './routes/course.route.js';
import userRoute from './routes/user.router.js';
import adminRoute from './routes/admin.route.js';
import orderRoute from './routes/order.route.js';

import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"],
}));

const PORT = process.env.PORT||3000;
const DB_URI = process.env.MONGO_URI;

try{
    await mongoose.connect(DB_URI);
    console.log('connected to db');
}catch(e){
    console.log(e);
}

// defining routes
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/order', orderRoute);


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

app.listen(PORT, ()=>{
    console.log(`App Listening on port ${PORT}`);
});