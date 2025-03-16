import jwt from 'jsonwebtoken';
import config from '../config.js';

function adminMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    // console.log(req.headers);
    // console.log(authHeader);
    if(!authHeader || !authHeader.split(' ')[0] === "Bearer"){
        return res.status(401).json({error:"No Token provided"});
    }
    const token = authHeader.split(" ")[1];
    // console.log(token);
    // console.log(config.JWT_ADMIN_SECRET);
    // const decoded = jwt.verify(token, config.JWT_ADMIN_SECRET);
    // console.log(decoded);
    try{
        const decoded = jwt.verify(token, config.JWT_USER_SECRET);
        req.adminId = decoded.id;
        next();
    }catch(error){
        return res.status(401).json({error:"Invalid Token"});
        console.log("Invalid token or expired token");
    }
}

export default adminMiddleware;