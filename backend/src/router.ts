import { Router } from 'express';
import {AppLogger} from "./logger";
import {stringify} from "qs";
import VirtualEnvController from "./controllers/VirtualEnvController";
const router = Router();


router.get( '/', );

router.get('/virtual_env', VirtualEnvController.index)
router.post('/virtual_env', VirtualEnvController.create)

router.get('/incoming', (req, res)=>{
    AppLogger.log({
        level: 'info',
        message: `Body ${stringify(req.body)}, params ${stringify(req.params)}, q ${stringify(req.query)}, h ${stringify(req.headers)}`
    })
    res.send(req.request);
});
export default router;