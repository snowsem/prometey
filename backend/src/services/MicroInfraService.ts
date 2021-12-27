import {Octokit} from 'octokit';
const YAML = require('yaml')
import crypto from 'crypto';

export class MicroInfraService {

    private api: any ;
    private repoSetting: any;

    constructor(accessToken) {
        this.api = new Octokit({ auth: `${accessToken}` });
        this.repoSetting = {
            mediaType: {
                format: "raw",
            },
            owner: "airslateinc",
            repo: "airslate-microservices-infra",
            path: "api",
            ref: "prometey-test-1"
        }
    }

    getAllServices = async ()=>{
        const { data } = await this.api.rest.repos.getContent(this.repoSetting);
        const services = data.map(item=>item.name)

        return services;

    }

    headersDecorator = (services)=>{
        return services.map(item=>`airslate-forward-variant-${item}`)
    }

    createServiceHeader = (serviceName)=>{
        return `airslate-forward-variant-${serviceName}`
    }

    getServiceValue = async (serviceName)=>{
        const { data } = await this.api.rest.repos.getContent({...this.repoSetting, path: `api/${serviceName}/stage/values.yaml`});

        return YAML.parse(data).global;
    }

    createBranch = async (branchName)=>{
        // const mainRef = await this.api.rest.git.getRef({...this.repoSetting, ref:'heads/main'});
        // const mainRefSha = mainRef.data.object.sha
        // const newBranch = await this.api.rest.git.createRef(
        //     {...this.repoSetting, ref:`refs/heads/${branchName}`, sha: mainRefSha}
        // )
        // return newBranch

        const file = await this.api.rest.repos.createOrUpdateFileContents({

        });


    }

    getServiceTags = async (serviceName)=>{
        const values = await this.getServiceValue(serviceName);
        console.log(values)
        const { data } = await this.api.rest.repos.listTags({
            owner: this.repoSetting.owner,
            repo: values.image.repository,
        });
        return data;
    }
}

