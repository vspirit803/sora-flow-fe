import axios from 'axios';

export class OrganizationsService {
  static getOrganizations() {
    return axios.get('organizations');
  }

  static getOrganizationDetail(id: string) {
    return axios.get(`organizations/${id}`);
  }

  static updateOrganization(updateOrganizationDto: UpdateOrganizationDto) {
    return axios.patch('organizations', updateOrganizationDto);
  }

  static createOrganization(createOrganizationDto: CreateOrganizationDto) {
    return axios.post('organizations', createOrganizationDto);
  }

  static deleteOrganization(deleteOrganizationDto: DeleteOrganizationDto) {
    return axios.delete('organizations', { data: deleteOrganizationDto });
  }
}

export interface CreateOrganizationDto {
  readonly name: string;
  readonly versionId: string;
  readonly supervisorId?: string;
}

export interface UpdateOrganizationDto {
  readonly id: string;
  readonly name?: string;
  readonly versionId?: string;
  readonly supervisorId?: string;
}

export interface DeleteOrganizationDto {
  readonly id: string;
}

export interface Organization {
  id: string;
  name: string;
  versionId: string;
  version: { id: string; name: string };
  supervisorId: string;
  supervisor: { id: string; name: string; nickname: string };
}
