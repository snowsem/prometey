import {Controller, Get, Inject} from '@nestjs/common';
import {MicroInfraRepoService} from "../services/micro-infra-repo.service";

@Controller('github')
export class GithubController {

    constructor(
        @Inject(MicroInfraRepoService)
        private repoService: MicroInfraRepoService,
    ) {}
    @Get('get-variants')
    public async getVariantsFromGithub(){

        await this.repoService.getRepo(process.env.GITHUB_REPO_BRANCH);
        return this.repoService.getAllValues()
    }
}
