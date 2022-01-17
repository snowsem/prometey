import { Octokit } from 'octokit';
import { stringify as yamlStr, parse as parseYaml } from 'yaml';
import crypto from 'crypto';
import { throws } from 'assert';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroInfraApiService {
  private api: any;
  private repoSetting: any;
  public forwardHeaderName: string;

  constructor() {
    this.api = new Octokit({ auth: `${process.env.GITHUB_API_TOKEN}` });
    this.forwardHeaderName = 'airslate-forward-variant-';
    this.repoSetting = {
      mediaType: {
        format: 'raw',
      },
      owner: process.env.GITHUB_REPO_OWNER || 'airslateinc',
      repo: process.env.GITHUB_REPO || 'airslate-microservices-infra',
      path: 'api',
      ref: process.env.GITHUB_REPO_BRANCH || 'custom-main',
      mainBranch: process.env.GITHUB_REPO_BRANCH || 'custom-main',
    };
  }

  getAllServices = async (branch = this.repoSetting.mainBranch) => {
    try {
      const { data } = await this.api.rest.repos.getContent({
        ...this.repoSetting,
        ref: branch,
      });
      const services = data.map((item) => item.name);

      return services;
    } catch (e) {
      if (e.status === 404) {
        return null;
      }
      return null;
    }
  };

  headersDecorator = (services) => {
    return services.map((item) => `${this.forwardHeaderName}${item}`);
  };

  createServiceHeader = (serviceName) => {
    return `${this.forwardHeaderName}${serviceName}`;
  };

  getServiceValue = async (serviceName) => {
    try {
      const { data } = await this.api.rest.repos.getContent({
        ...this.repoSetting,
        path: `api/${serviceName}/stage/values.yaml`,
      });
      return parseYaml(data).global;
    } catch (e) {
      if (e.status === 404) {
        return null;
      }
      return null;
    }
  };

  getBranch = async (branchName) => {
    try {
      const ref = await this.api.rest.git.getRef({
        ...this.repoSetting,
        ref: `heads/${branchName}`,
      });
      return ref;
    } catch (e) {
      throw e;
    }
  };

  getMainBranchSha = async () => {
    try {
      const mainRef = await this.getBranch(this.repoSetting.mainBranch);
      const mainRefSha = mainRef.data.object.sha;
      return mainRefSha;
    } catch (e) {
      return null;
    }
  };
  createBranch = async (branchName) => {
    try {
      const mainRefSha = await this.getMainBranchSha();
      const newBranch = await this.api.rest.git.createRef({
        ...this.repoSetting,
        ref: `refs/heads/${branchName}`,
        sha: mainRefSha,
      });
      return newBranch;
    } catch (e) {
      throw e;
    }
  };

  deleteBranch = async (branchName) => {
    try {
      const newBranch = await this.api.rest.git.deleteRef({
        ...this.repoSetting,
        ref: `heads/${branchName}`,
      });
      return true;
    } catch (e) {
      if (e.status === 422) {
        return true;
      } else {
        throw e;
      }
    }
  };

  createOrUpdateFileInBranch = async (content, filePath, branch, message) => {
    try {
      const fileSha = await this.getFileSha(filePath, branch);
      const file = await this.api.rest.repos.createOrUpdateFileContents({
        owner: this.repoSetting.owner,
        repo: this.repoSetting.repo,
        path: filePath,
        message: message,
        sha: fileSha,
        content: content,
        branch: branch,
        'committer.name': 'snowsem',
        'committer.email': 'snowsem@rambler.ru',
        'author.name': 'snowsem',
        'author.email': 'snowsem@rambler.ru',
      });

      return file;
    } catch (e) {
      throw e;
    }
  };

  deleteFileInBranch = async (filePath, branch, message) => {
    try {
      const fileSha = await this.getFileSha(filePath, branch);
      const file = await this.api.rest.repos.deleteFile({
        owner: this.repoSetting.owner,
        repo: this.repoSetting.repo,
        path: filePath,
        message: message,
        sha: fileSha,
        branch: branch,
        'committer.name': 'snowsem',
        'committer.email': 'snowsem@rambler.ru',
        'author.name': 'snowsem',
        'author.email': 'snowsem@rambler.ru',
      });

      return file;
    } catch (e) {
      if (e.status === 404) {
        return null;
      } else {
        throw e;
      }
    }
  };

  // createBranch = async (branchName)=>{
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

  // }

  getServiceTags = async (serviceName) => {
    try {
      const values = await this.getServiceValue(serviceName);
      console.log(values);
      const { data } = await this.api.rest.repos.listTags({
        owner: this.repoSetting.owner,
        repo: values.image.repository,
      });
      return data;
    } catch (e) {
      if (e.status === 404) {
        return null;
      }
      return null;
    }
  };

  getFileSha = async (filePath, branch) => {
    try {
      const {
        data: { sha },
      } = await this.api.request(
        'GET /repos/{owner}/{repo}/contents/{file_path}',
        {
          owner: this.repoSetting.owner,
          repo: this.repoSetting.repo,
          ref: branch,
          file_path: filePath,
        },
      );
      console.log(sha);
      return sha;
    } catch (e) {
      if (e.status === 404) {
        return null;
      }
      return null;
    }
  };

  timeout = (callback) => {
    return setTimeout(() => {
      callback();
    }, 500);
  };

  getValues = async (branch = this.repoSetting.mainBranch) => {
    try {
      const services = await this.getAllServices(branch);
      const map = await services.map((srv) => {
        return this.api.rest.repos.getContent({
          ...this.repoSetting,
          ref: branch,
          path: `api/${srv}/stage`,
        });
      });

      const mapResolve = await Promise.all(map);
      return services.map((srv, i) => {
        const v = [];
        mapResolve[i].data.forEach((item) => {
          const str = item.name;
          if (str.includes('values-')) {
            v.push(item.name);
          }
        });
        return {
          serviceName: srv,
          values: v,
        };
      });
    } catch (e) {
      console.log('getValues', e);
      return null;
    }
  };

  getRepo = async (branch) => {
    const r = await this.api.rest.repos.downloadZipballArchive({
      owner: this.repoSetting.owner,
      repo: this.repoSetting.repo,
      ref: branch,
    });

    return r;
  };

  merge = async (into, youBranch) => {
    const r = await this.api.rest.repos.merge({
      owner: this.repoSetting.owner,
      repo: this.repoSetting.repo,
      base: this.repoSetting.mainBranch,
      head: youBranch,
    });
  };

  // getTree = async ()=>{
  //     const { data } = await this.api.rest.repos.getContent({...this.repoSetting, path: ``});
  //     const api = data.filter(item=>{
  //         if (item.name === 'api/addons') {
  //             return true
  //         }
  //     })
  //     try {
  //         const a = await this.api.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=true', {
  //             owner: this.repoSetting.owner,
  //             repo: this.repoSetting.repo,
  //             tree_sha: api.sha
  //         })
  //         console.log(a.data.tree)
  //
  //     } catch (e) {
  //         console.log(e)
  //     }
  //
  // }
}
