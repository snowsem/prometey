import jwt from "jsonwebtoken";
import {User} from "../entity/User";

export const authMiddleware = async (req, res, next)=>{
    let token = req.body.token || req.query.token;

    if (req.headers["authorization"]) {
        const bearer = req.headers["authorization"].split(' ');
        token = bearer[1];
    }

    if (!token) {
        console.log('not found',token)
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log(decoded?.user_email)
        let user = await User.findOne({ email: decoded?.user_email });
        if (user) {
            req.user = user
            return next();
        } else {
            return res.status(403).send("User not found");
        }

    } catch (err) {
        console.log('e', token)
        return res.status(401).send("Invalid Token");
    }
}