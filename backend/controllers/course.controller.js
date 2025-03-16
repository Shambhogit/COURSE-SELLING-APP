import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req, res) => {
    const adminId = req.adminId;

    const { title, description, price } = req.body;
    try {
        if (!title || !description || !price) {
            return res.status(400).json({ error: 'all fields are required' });
        }

        const { image } = req.files;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const allowedFormat = ["image/png", "image/jpeg"];

        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ error: "Invalid file format" });
        }

        //cloudinary code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ error: "Error uploading image to cloudinary" });
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url
            },
            creatorId: adminId,
        };

        let course = await Course.create(courseData);

        res.json({
            message: "Course Created Succsesfully",
            course
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating course' });
    }
}

export const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, price, image } = req.body;
    const adminId = req.adminId;


    try {
        const courseSearch = await Course.findOne({_id:courseId});
        if(!courseSearch){
            return res.status(404).json({error:"Course Not Found"});
        }
        
        const course = await Course.updateOne({ _id: courseId, creatorId: adminId },
            {
                title,
                description,
                price,
                image: {
                    public_id: image.public_id,
                    url: image?.url,
                }
            }
        )
        res.status(201).json({ message: "Course Updated Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error in Course Updating" });
        console.log('Error in course : ', error);
    }
}

export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const adminId = req.adminId;
    try {
        const course = await Course.findOneAndDelete({ _id: courseId, creatorId: adminId });
        if (!course) {
            return res.status(404).json({ error: "Course Not Found" });
        }
        res.status(201).json({ message: "Course Deleted Successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error in deleting course" });
        console.log("There is error in code ", error);
    }
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(201).json({ Courses: courses });
    } catch (error) {
        console.log(error);
    }
}

export const getCourseDetails = async (req, res) => {
    const { courseId } = req.params;
    console.log(courseId);
    try {
        const course = await Course.findOne({ _id: courseId });
        console.log(course);
        if (!course) {
            return res.status(404).json({ error: "Course Not Found" });
        }
        res.status(201).json({ course });
    } catch (error) {
        res.status(500).json("Error in finding Course");
        console.log(error);
    }
}


import Stripe from 'stripe';
import config from '../config.js';
const stripe = new Stripe(config.STRIPE_SECRETE_KEY);

export const buyCourse = async (req, res) => {
    const userId = req.userId;
    const courseId = req.params.courseId;

    // console.log(userId);

    try {
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).json({ error: "Course Not Found" });
        }
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ error: "User already have that course" })
        }

        //stripe payment code goes here!!
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price,
            currency: "usd",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            payment_method_types:['card'],
        });

        const clientSecret = paymentIntent.client_secret;


        return res.status(201).json({ message: "Data fetched success", clientSecret, course});

    } catch (error) {
        res.status(500).json({ error: "Error in Course Buying" });
        console.log("Error in Course buying", error);
    }

}