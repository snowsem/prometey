import {forwardRef, Module} from '@nestjs/common';
import {VenvService} from './services/venv.service';
import {VirtualEnvController} from './controllers/virtual-env.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {VirtualEnv} from './entity/virtual-env.entity';
import {VirtualEnvService} from './entity/virtual-env-service.entity';
import {User} from '../auth/entity/user.entity';
import {GithubModule} from '../github/github.module';
import {MicroInfraService} from './entity/micro-infra-service.entity';
import {VenvCronService} from './services/venv-cron.service';
import {BullModule} from '@nestjs/bull';
import {CreateVirtualEnvProcessor} from './processors/create-virtual-env.processor';

import {SendMessageWsProcessor} from "../websocket/processors/send-message-ws.processor";
import {WebsocketModule} from "../websocket/websocket.module";
import {BrowserExtensionController} from "./controllers/browser-extension.controller";

@Module({
    imports: [
        WebsocketModule,
        forwardRef(() => GithubModule),
        BullModule.registerQueue({
            name: CreateVirtualEnvProcessor.getQueueName(),
        }, {
            name: SendMessageWsProcessor.getQueueName(),
        }),
        TypeOrmModule.forFeature([
            VirtualEnv,
            VirtualEnvService,
            MicroInfraService,
            User,
        ]),
    ],
    providers: [VenvService, VenvCronService, CreateVirtualEnvProcessor],
    exports: [VenvService, CreateVirtualEnvProcessor],
    controllers: [VirtualEnvController, BrowserExtensionController],
})
export class VirtualEnvModule {
}
