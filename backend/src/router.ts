import { Router } from 'express';
import {AppLogger} from "./logger";
import {stringify} from "qs";
import VirtualEnvController from "./controllers/VirtualEnvController";
import GitHubController from "./controllers/GitHubController";
import AuthController from "./controllers/AuthController";
import jwt from "jsonwebtoken";
import {User} from "./entity/User";
const router = Router();


const authMiddleware = async (req, res, next)=>{
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
            return next();
        } else {
            return res.status(403).send("User not found");
        }

    } catch (err) {
        console.log('e', token)
        return res.status(401).send("Invalid Token");
    }
}

router.get( '/', );

router.get('/virtual_env', VirtualEnvController.index)
router.get('/virtual_env/:id', VirtualEnvController.show)
router.delete('/virtual_env/:id', VirtualEnvController.delete)
router.patch('/virtual_env/:id', VirtualEnvController.update)
router.post('/virtual_env', VirtualEnvController.create)
router.get('/get_services', GitHubController.getAvailableService)
router.get('/get_service_tags/:name', GitHubController.getServiceTags)
router.post('/create_pull_request', GitHubController.createPullRequest)
router.post('/auth/google', AuthController.authenticateUserByGoogle)
router.get('/auth/me', authMiddleware, AuthController.me)

export default router;