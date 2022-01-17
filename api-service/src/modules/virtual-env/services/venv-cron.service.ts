import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { VenvService } from './venv.service';

@Injectable()
export class VenvCronService {
  constructor(@Inject(VenvService) private venvService: VenvService) {}

  @Cron('1 * * * *')
  public async getAllGitHubServices() {
    await this.venvService.importAllServices();
  }
}
