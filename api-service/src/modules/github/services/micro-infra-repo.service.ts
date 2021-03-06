import { stringify as yamlStr, parse as parseYaml } from 'yaml';
import { MicroInfraApiService } from './micro-infra-api.service';
import { Injectable } from '@nestjs/common';

const AdmZip = require('adm-zip');
//import * as AdmZip from 'adm-zip';

@Injectable()
export class MicroInfraRepoService {
  private microInfraService: MicroInfraApiService;
  private repoData: any;
  private repoPaths: any;
  private rootNodeKey: any;
  private env: string;
  private defaultValueFile: string;

  constructor() {
    this.microInfraService = new MicroInfraApiService();
    this.env = 'stage';
    this.defaultValueFile = 'values.yaml';
  }

  getRepo = async (branch) => {
    const a = await this.microInfraService.getRepo(branch);
    this.repoData = new AdmZip(Buffer.from(a.data, 'utf-8'));

    const zipEntries = this.repoData.getEntries(); // an array of ZipEntry records
    const paths = [];
    zipEntries.forEach(function (zipEntry) {
      paths.push(zipEntry.entryName.toString('utf8'));
    });
    this.repoPaths = this.filePathObject(paths);
    this.rootNodeKey = Object.keys(this.repoPaths)[0];
    return this;
  };

  getRepoTree = () => {
    return this.repoPaths[this.rootNodeKey];
  };

  getRootNodeKey = () => {
    return this.rootNodeKey;
  };

  getFileByPath = (path) => {
    return this.repoData
      .getEntry(`${this.rootNodeKey}/${path}`)
      .getData()
      .toString('utf8');
  };

  getAllServices = (folder = 'api') => {
    return Object.keys(this.getRepoTree()[folder]);
  };

  getServiceDefaultValue = (serviceName, folder = 'api') => {
    return parseYaml(
      this.getFileByPath(
        `${folder}/${serviceName}/${this.env}/${this.defaultValueFile}`,
      ),
    ).global;
  };

  getServiceMainValue = (serviceName, folder = 'api') => {
    return parseYaml(
        this.getFileByPath(
            `${folder}/${serviceName}/${this.env}/${this.defaultValueFile}`,
        ),
    ).main || null;
  };

  getAllValues = (folder = 'api') => {
    const services = this.getAllServices();
    const map = services.map((srv) => {
      const v = [];
      const repoValues = this.getRepoTree()[folder][srv][this.env];

      repoValues.forEach((value, key) => {
        const str = value;
        if (str.includes('values-') && str.includes('.yaml')) {
          v.push(value);
        }
      });

      return {
        serviceName: srv,
        values: v,
      };
    });
    return map;
  };

  getAllValuesPathByVirtualEnv = (virtualEnv, folder = 'api') => {
    const services = this.getAllServices();
    const v = [];
    services.forEach((srv) => {
      const repoValues = this.getRepoTree()[folder][srv][this.env];

      repoValues.forEach((value, key) => {
        const str = value;
        if (str.includes(`values-${virtualEnv}.yaml`)) {
          v.push(`${folder}/${srv}/${this.env}/${value}`);
        }
      });
    });
    return v;
  };

  getServiceValues = (serviceName, folder = 'api') => {
    const v = [];
    const repoValues = this.getRepoTree()[folder][serviceName][this.env];

    repoValues.forEach((value, key) => {
      const str = value;
      if (str.includes('values-') && str.includes('.yaml')) {
        v.push(value);
      }
    });

    return v;
  };

  filePathObject = (arr) => {
    const ret = {};
    arr.forEach((path) => {
      const dirs = path.split('/');
      const filename = dirs.pop();
      let dirObject = ret;
      dirs.forEach((dir, i) => {
        if (i === dirs.length - 1) {
          dirObject[dir] = dirObject[dir] || [];
          if (filename !== '') dirObject[dir].push(filename);
        } else {
          dirObject[dir] = dirObject[dir] || {};
        }
        dirObject = dirObject[dir];
      });
    });

    return ret;
  };
}
