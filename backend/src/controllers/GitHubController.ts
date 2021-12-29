import {Request, Response} from "express";
import {MicroInfraService} from "../services/MicroInfraService";
import {getRepository} from "typeorm";
import {MicroInfraService as MicroInfraServiceEntity} from "../entity/MicroInfraService";

class GitHubController {
    async getServiceTags(req: Request, res: Response) {

        const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
        const tags = await microInfraService.getServiceTags(req.params.name)
        console.log(tags)

        return res.json({ code: 'ok', data: tags });
    }

    async getAvailableService(req: Request, res: Response) {

        const limit = req.query.limit ? parseInt(<string>req.query.limit) : 500;
        const offset = req.query.offset ? parseInt(<string>req.query.offset) : 0;

        const MicroInfraServiceRepo = getRepository(MicroInfraServiceEntity);
        const [data, count] = await MicroInfraServiceRepo.findAndCount({
            cache:false,
            skip: offset * limit,
            take: limit,
            order: {
                name: "DESC"
            },
        });

        const totalPages = Math.ceil(count / limit)
        const currentPage = Math.ceil(count % limit)

        return res.json({ code: 'ok',
            total: count,
            count: data.length,
            pages: totalPages,
            currentPage: currentPage,
            data: data
        });
    }

    async createPullRequest(req: Request, res: Response) {
        const microInfraService = new MicroInfraService(process.env.GITHUB_API_TOKEN);
        const b = await microInfraService.createBranch('test-semen');
        res.send({code:'ok', data: b})
    }
}

export default new GitHubController();