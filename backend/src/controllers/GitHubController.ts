import {Request, Response} from "express";
import {MicroInfraService} from "../services/MicroInfraService";

class GitHubController {
    async getServiceTags(req: Request, res: Response) {

        const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
        const tags = await microInfraService.getServiceTags(req.params.name)
        console.log(tags)

        return res.json({ code: 'ok', data: tags });
    }

    async getAvailableService(req: Request, res: Response) {
        const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
        const services = await microInfraService.getAllServices()
        return res.json({ code: 'ok', data: services });

    }
}

export default new GitHubController();