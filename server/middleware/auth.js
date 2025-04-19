import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export { authenticate };
// export default authenticate;