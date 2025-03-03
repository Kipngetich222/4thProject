import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) =>{
        const token = jwt.sign({userId}, process.env.JWT_SECRETE, {
            expires:"10min"
        });
        res.cookie("jwt", token, {
            maxAge : 1000*60*10,
            httpOnly : true,
            sameSite : "strick",
            secure : process.env.NODE_EN !== "development"
        });
        return token;
}