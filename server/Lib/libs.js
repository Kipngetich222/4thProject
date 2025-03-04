import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) =>{
        const token = jwt.sign({userId}, process.env.JWT_SECRETE, {
            expiresIn:"10m"
        });
        res.cookie("jwt", token, {
            maxAge : 1000*60*10,
            httpOnly : true,
            sameSite : "strict",
            secure : process.env.NODE_EN !== "development"
        });
        return token;
}