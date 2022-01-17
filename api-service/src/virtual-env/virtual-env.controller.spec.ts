import { Test, TestingModule } from '@nestjs/testing';
import { VirtualEnvController } from './virtual-env.controller';

describe('VirtualEnvController', () => {
  let controller: VirtualEnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualEnvController],
    }).compile();

    controller = module.get<VirtualEnvController>(VirtualEnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
