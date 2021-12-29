import {getRepository} from "typeorm";
import {MicroInfraService} from "../services/MicroInfraService";
import {MicroInfraService as MicroInfraServiceEntity} from "../entity/MicroInfraService";

export const importAllServices = async ()=>{
    const infraService = new MicroInfraService();
    const gitServices = await infraService.getAllServices();

    const valuesMap = gitServices.map((srv)=>{
        return infraService.getServiceValue(srv)
    })

    let values = await Promise.all(valuesMap);

    const microInfraServiceRepository = getRepository(MicroInfraServiceEntity);
    const serviceValues = values.map((v,i)=>{
        return microInfraServiceRepository.create({
            name: gitServices[i],
            repository: v.image.repository,
            default_tag: v.image.tag
        })
    });

    const result = await microInfraServiceRepository.save(serviceValues)
    return result;


}