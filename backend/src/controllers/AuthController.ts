import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {getRepository} from "typeorm";
import {User} from "../entity/User";
import jwt from 'jsonwebtoken'

class AuthController {

    authenticateUserByGoogle = async (req: Request, res: Response)=>{
        const googleClient = new OAuth2Client({
            clientId: `${process.env.GOOGLE_CLIENT_ID}`,
        });

        const { token } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: `${process.env.GOOGLE_CLIENT_ID}`,
            audient: `${process.env.GOOGLE_CLIENT_ID}`,
        });

        const userRepo = getRepository(User);

        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload?.email });

        const _token = jwt.sign(
            { user_id: user.id, user_email: user.email, token_google: token },
            process.env.TOKEN_KEY,
            {
                expiresIn: "30d",
            }
        );

        if (!user) {
            user = new User()
            user.email = payload?.email
            user.avatar = payload?.picture
            user.first_name = payload?.name
            user.token_google = token
            user.token = _token;

            await userRepo.save(user);
        }

        res.json({ user:user, token:_token });

    }

    me = async (req: Request, res: Response)=>{
        let token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (req.headers["authorization"]) {
            const bearer = req.headers["authorization"].split(' ');
            token = bearer[1];
        }

        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            let user = await User.findOne({ email: decoded?.user_email });
            res.json({ user:user });

        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }

}

export default new AuthController();
