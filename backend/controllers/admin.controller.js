
import bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken';
import zod from 'zod';
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res)=>{
    const {firstName, lastName, email, password} = req.body;
    
    const adminSchema = zod.object({
        firstName: zod.string().min(4,{message:"first name should be of more than 4 chars"}),
        lastName: zod.string().min(4,{message:"Last name should be of more than 4 chars"}),
        email: zod.string().email(),
        password: zod.string().min(8, {message:"Password must be of 8 chars"})
    });

    const validationData = adminSchema.safeParse(req.body);
    if(!validationData.success){
        return res.status(400).json({errors:validationData.error.issues.map(err => err.message)});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({error:"Admin Already Exist"});
        }
        const adminData={
            firstName,
            lastName,
            email,
            password:hashedPassword
        }
        const createdAdmin = await Admin.create(adminData);
        res.status(201).json({message:"Signup Succeeded", createdAdmin});
    } catch (error) {
        res.status(500).json({error:"Error in signup"});
        console.log("Error in Signup", error);
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(403).json({error:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if(!isPasswordCorrect){
            return res.status(403).json({error:"Invalid credentials"});
        }

        // console.log(config.JWT_USER_SECRET);
        //jwt code
        const token = jwt.sign(
            {
                id:admin._id
            },
            config.JWT_ADMIN_SECRET,
            {expiresIn:"1d"}
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:"Strict"
        }
        res.cookie("jwt", token, cookieOptions);

        res.status(201).json({message:"Login Successful", admin});
    }catch(error){
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
