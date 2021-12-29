import {Octokit} from 'octokit';
const YAML = require('yaml')
import crypto from 'crypto';

export class MicroInfraService {

    private api: any ;
    private repoSetting: any;

    constructor(accessToken = process.env.GITHUB_API_TOKEN) {
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
        try {
            const { data } = await this.api.rest.repos.getContent(this.repoSetting);
            const services = data.map(item=>item.name)

            return services;
        } catch (e) {
            if (e.status === 404) {
                return null
            }
            return null;
        }
    }

    headersDecorator = (services)=>{
        return services.map(item=>`airslate-forward-variant-${item}`)
    }

    createServiceHeader = (serviceName)=>{
        return `airslate-forward-variant-${serviceName}`
    }

    getServiceValue = async (serviceName)=>{
        try {
            const { data } = await this.api.rest.repos.getContent({...this.repoSetting, path: `api/${serviceName}/stage/values.yaml`});
            return YAML.parse(data).global;
        } catch (e) {
            if (e.status === 404) {
                return null
            }
            return null;
        }
    }

    getMainBranchSha = async ()=>{
        try {
            const mainRef = await this.api.rest.git.getRef({...this.repoSetting, ref:'heads/main'});
            const mainRefSha = mainRef.data.object.sha
            return mainRefSha
        } catch (e) {
            return null
        }
    }

    createBranch = async (branchName)=>{
        // const mainRef = await this.api.rest.git.getRef({...this.repoSetting, ref:'heads/main'});
        // const mainRefSha = mainRef.data.object.sha
        // const newBranch = await this.api.rest.git.createRef(
        //     {...this.repoSetting, ref:`refs/heads/${branchName}`, sha: mainRefSha}
        // )
        // return newBranch
        // let b = new Buffer('Node');
        // let s = b.toString('base64');
        //
        // const fileSha =await this.getFileSha('api/slates/stage/values-semen.yaml', 'semen-branch')
        // const file = await this.api.rest.repos.createOrUpdateFileContents({
        //     owner: this.repoSetting.owner,
        //     repo: this.repoSetting.repo,
        //     path: 'api/slates/stage/values-semen.yaml',
        //     message:'test commit -1',
        //     sha: fileSha,
        //     content:s,
        //     branch: 'semen-branch',
        //     "committer.name":'snowsem',
        //     "committer.email":'snowsem@rambler.ru',
        //     "author.name":'snowsem',
        //     "author.email":'snowsem@rambler.ru'
        // });
        //
        // return file

        // const createPull = this.api.rest.pulls.create({
        //     owner: this.repoSetting.owner,
        //     repo: this.repoSetting.repo,
        //     head: 'semen-branch',
        //     base: 'main',
        //     title: 'test pull',
        // });
        //
        // return createPull

        //const  data  = await this.api.rest.repos.getContent({...this.repoSetting, ref:'semen-branch', path: `api/slates/stage/values-semen.yaml`});



    }

    getServiceTags = async (serviceName)=>{
        try {
            const values = await this.getServiceValue(serviceName);
            console.log(values)
            const { data } = await this.api.rest.repos.listTags({
                owner: this.repoSetting.owner,
                repo: values.image.repository,
            });
            return data;
        } catch (e) {
            if (e.status === 404) {
                return null
            }
            return null
        }

    }

    getFileSha = async (filePath, branch) =>{
        try {
            const { data: { sha } } = await this.api.request('GET /repos/{owner}/{repo}/contents/{file_path}', {
                owner: this.repoSetting.owner,
                repo: this.repoSetting.repo,
                ref: branch,
                file_path: filePath
            });
            console.log(sha)
            return sha
        } catch (e) {
            if (e.status === 404) {
                return null
            }
            return null
        }
    }

    timeout = (callback)=> {
        return setTimeout(()=>{
            callback();
        }, 500)
    }

}

