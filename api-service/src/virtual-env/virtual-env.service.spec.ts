import { Test, TestingModule } from '@nestjs/testing';
import { VirtualEnvService } from './virtual-env.service';

describe('VirtualEnvService', () => {
  let service: VirtualEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualEnvService],
    }).compile();

    service = module.get<VirtualEnvService>(VirtualEnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
