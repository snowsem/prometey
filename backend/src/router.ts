import { Router } from 'express';
import {AppLogger} from "./logger";
import {stringify} from "qs";
import VirtualEnvController from "./controllers/VirtualEnvController";
import GitHubController from "./controllers/GitHubController";
const router = Router();


router.get( '/', );

router.get('/virtual_env', VirtualEnvController.index)
router.get('/virtual_env/:id', VirtualEnvController.show)
router.delete('/virtual_env/:id', VirtualEnvController.delete)
router.patch('/virtual_env/:id', VirtualEnvController.update)
router.post('/virtual_env', VirtualEnvController.create)
router.get('/get_services', GitHubController.getAvailableService)
router.get('/get_service_tags/:name', GitHubController.getServiceTags)
router.post('/create_pull_request', GitHubController.createPullRequest)

export default router;