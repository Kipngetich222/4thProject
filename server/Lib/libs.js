// import jwt from 'jsonwebtoken';

// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "60m", // 1 hour
//   });

//   res.cookie("token", token, {
//     maxAge: 1000 * 60 * 60, // 1 hour
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development", // ✅ Fixed typo
//   });
//   console.log("Token generated:", token); // Debug log
//   //console.log("cookies", res.cookie)
//   console.log("Cookies sent:", res.getHeaders()["set-cookie"]);
//   return token;
// };

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
