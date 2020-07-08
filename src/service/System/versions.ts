import axios from 'axios';

export class VersionsService {
  static getVersions() {
    return axios.get('versions');
  }

  static updateVersion(updateVersionDto: UpdateVersionDto) {
    return axios.patch('versions', updateVersionDto);
  }

  static createVersion(createVersionDto: CreateVersionDto) {
    return axios.post('versions', createVersionDto);
  }

  static deleteVersion(deleteVersionDto: DeleteVersionDto) {
    return axios.delete('versions', { data: deleteVersionDto });
  }
}

export interface CreateVersionDto {
  readonly name: string;
  readonly authorizedOperations: Array<string>;
}

export interface UpdateVersionDto {
  readonly id: string;
  readonly name?: string;
  readonly authorizedOperations?: Array<string>;
}

export interface DeleteVersionDto {
  readonly id: string;
}

export interface Version {
  id: string;
  name: string;
  roleId: string;
}
