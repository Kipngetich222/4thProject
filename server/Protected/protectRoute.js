import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({error : "Unauthorised No access token"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(402).json({error : "Unauthorised no access token"});
    }

   

    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(402).json({error : "Unauthorised no access token"});
    }

    req.user = user;
    next();
    
    } catch(error){
        console.log(error);
        return res.status(500).json({error : "user not found"});
    }
};


export default protectRoute;