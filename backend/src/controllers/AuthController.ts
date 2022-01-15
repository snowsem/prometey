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
        try {
            let user = await User.findOne({ email: req.user.user_email });
            res.json({ user:user });
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }

}

export default new AuthController();
