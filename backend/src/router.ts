import { Router } from 'express';
import {AppLogger} from "./logger";
import {stringify} from "qs";
import VirtualEnvController from "./controllers/VirtualEnvController";
const router = Router();


router.get( '/', );

router.get('/virtual_env', VirtualEnvController.index)
router.get('/virtual_env/:id', VirtualEnvController.show)
router.delete('/virtual_env/:id', VirtualEnvController.delete)
router.post('/virtual_env', VirtualEnvController.create)
router.post('/get_services', VirtualEnvController.getAvailableService)

export default router;