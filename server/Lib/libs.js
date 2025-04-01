import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) =>{
<<<<<<< HEAD
        const token = jwt.sign({userId}, process.env.JWT_SECRET, {
=======
        const token = jwt.sign({userId}, process.env.JWT_SECRETE, {
>>>>>>> f52d277c6a5cefe4e45ca931faec25f772d61095
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