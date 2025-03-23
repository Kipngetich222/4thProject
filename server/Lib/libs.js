import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) =>{
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {
            expiresIn:"60m"
        });
        res.cookie("jwt", token, {
            maxAge : 1000*60*60,
            httpOnly : true,
            sameSite : "strict",
            secure : process.env.NODE_EN !== "development"
        });
        return token;
}