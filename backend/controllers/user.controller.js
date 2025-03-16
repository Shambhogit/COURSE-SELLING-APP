import { User } from "../models/user.model.js";
import bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken';
import zod from 'zod';
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";


export const signup = async (req, res)=>{
    const {firstName, lastName, email, password} = req.body;
    
    const userSchema = zod.object({
        firstName: zod.string().min(4,{message:"first name should be of more than 4 chars"}),
        lastName: zod.string().min(4,{message:"Last name should be of more than 4 chars"}),
        email: zod.string().email(),
        password: zod.string().min(8, {message:"Password must be of 8 chars"})
    });

    const validationData = userSchema.safeParse(req.body);
    if(!validationData.success){
        return res.status(400).json({error:validationData.error.issues.map(err => err.message)});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:"User Already Exist"});
        }
        const userData={
            firstName,
            lastName,
            email,
            password:hashedPassword
        }
        const createdUser = await User.create(userData);
        res.status(201).json({message:"Signup Succeeded", createdUser});
    } catch (error) {
        res.status(500).json({error:"Error in signup"});
        console.log("Error in Signup", error);
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(403).json({error:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).json({error:"Invalid credentials"});
        }

        // console.log(config.JWT_USER_SECRET);
        //jwt code
        const token = jwt.sign(
            {
                id:user._id
            },
            config.JWT_USER_SECRET,
            {expiresIn:"1d"}
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:"Strict"
        }
        res.cookie("jwt", token, cookieOptions);

        res.status(201).json({message:"Login Successful", token, user});
    }catch(error){
        res.status(500).json({error});
        console.log("Error in user", error);
    }
}

export const logout = (req, res) => {
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({error:"Kindly login first"});
        }
        res.clearCookie('jwt');
        res.status(201).json({message:"logout successful"});
    } catch (error) {
        res.status(500).json({error:"Error in logout"});
        console.log("Error in logout", error);
    }
}

export const purchases = async (req, res) => {
    const userId = req.userId;
    try {
        const purchased = await Purchase.find({userId});
        let purchasedCourseId = [];
        for(let i=0;i<purchased.length;i++){
            purchasedCourseId.push(purchased[i].courseId);
        }
        const courseData = await Course.find({
            _id:{$in:purchasedCourseId}
        })

        res.status(200).json({purchased, courseData});

    } catch (error) {
        res.status(500).json({error:"Error in data"});
        console.log("Error in Purchase", error);
    }
}
