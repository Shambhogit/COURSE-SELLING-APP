import jwt from 'jsonwebtoken';
import config from '../config.js';

function userMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if(!authHeader || !authHeader.split(' ')[0] === "Bearer"){
        return res.status(401).json({error:"No Token provided"});
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, config.JWT_USER_SECRET);
        req.userId = decoded.id;
        next();
    }catch(error){
        return res.status(401).json({error:"Invalid Token"});
        console.log("Invalid token or expired token");
    }
}

export default userMiddleware;