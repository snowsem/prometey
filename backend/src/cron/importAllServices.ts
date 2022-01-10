import {getRepository} from "typeorm";
import {MicroInfraService as MicroInfraServiceEntity} from "../entity/MicroInfraService";
import {MicroInfraRepoService} from "../services/MicroInfraRepoService";

export const importAllServices = async ()=>{
    const infraRepoService = new MicroInfraRepoService();
    await infraRepoService.getRepo('prometey-test-1');
    const gitServices = await infraRepoService.getAllServices();

    const valuesMap = gitServices.map((srv)=>{
        return infraRepoService.getServiceDefaultValue(srv)
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