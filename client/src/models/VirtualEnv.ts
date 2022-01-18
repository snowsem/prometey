import { IMicroInfraServices } from './MicroInfraServices';
import { IUser } from './User';

type VirtualEnvStatus = 'pending' | 'wait_pr' | 'ready' | 'wait_delete';

interface IVirtualEnv {
  id: string;
  title: string;
  owner: string;
  description: string;
  created_at: string;
  updated_at: number;
  status: VirtualEnvStatus;
  user_id: number;
  virtualEnvServices: IMicroInfraServices;
  user: IUser,
}

export {
  IVirtualEnv,
  VirtualEnvStatus,
};
