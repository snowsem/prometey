import { api } from './client';
import { IMicroInfraServices } from '../../models/MicroInfraServices';
import { IVirtualEnv } from '../../models/VirtualEnv';

type VirtualEnvServicesPayload = {
  service_name: string,
  service_github_tag: string,
}[];

interface IVirtualEnvsResponse {
  total: number;
  pages: number;
  count: number;
  currentPage: number;
  data: IVirtualEnv[];
}

function getServices() {
  return api().get<IMicroInfraServices>('/api/v1/virtual-env/get-services');
}

function getVirtualEnvs(queryParams: string) {
  return api().get<IVirtualEnvsResponse>(`/api/v1/virtual-env?${queryParams}`);
}

function getVirtualEnv(envId: string) {
  return api().get<IVirtualEnv>(`/api/v1/virtual-env/${envId}`);
}

function postVirtualEnv(data: { title: string, virtualEnvServices: VirtualEnvServicesPayload }) {
  return api().post<IVirtualEnv>('/api/v1/virtual-env', data);
}

export {
  getServices,
  getVirtualEnvs,
  postVirtualEnv,
  VirtualEnvServicesPayload,
  IVirtualEnvsResponse,
  getVirtualEnv,
};
