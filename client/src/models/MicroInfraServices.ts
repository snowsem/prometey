interface IService {
  name: string;
  repository: string;
  default_tag: string;
  description: string;
  created_at: string;
  updated_at: number;
}

type IMicroInfraServices = IService[];

export {
  IService,
  IMicroInfraServices,
};
