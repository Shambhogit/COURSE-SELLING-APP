import dotenv from 'dotenv';
dotenv.config();

const JWT_USER_SECRET=process.env.JWT_USER_SECRET;
const JWT_ADMIN_SECRET=process.env.JWT_ADMIN_SECRET;
const STRIPE_SECRETE_KEY = "sk_test_51QywFUAtGfHEs5DuzT7t2GFlrDoKgM2NMFs8tFPTLXlEmJFTWk6rk659Ynbz2KsTExT1VZs48EdQywoScMk6LKZe00OBvfwZ2f";
export default{
    JWT_USER_SECRET,
    JWT_ADMIN_SECRET,
    STRIPE_SECRETE_KEY,
}
