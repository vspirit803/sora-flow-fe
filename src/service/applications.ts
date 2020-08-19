import axios, { AxiosResponse } from 'axios';

export class ApplicationsService {
  static getApplication(
    id: string,
  ): Promise<
    AxiosResponse<Application & { creator: { id: string; name: string }; lastModifier?: { id: string; name: string } }>
  > {
    return axios.get(`applications/${id}`);
  }

  static getApplications(queryApplicationDto?: QueryApplicationDto): Promise<AxiosResponse<Array<Application>>> {
    return axios.get('applications', { data: queryApplicationDto });
  }

  static createApplication(createApplicationDto: CreateApplicationDto) {
    return axios.post('applications', createApplicationDto);
  }

  static updateApplication(updateApplicationDto: UpdateApplicationDto) {
    return axios.patch('applications', updateApplicationDto);
  }

  static deleteApplication(deleteApplicationDto: DeleteApplicationDto) {
    return axios.delete('applications', { data: deleteApplicationDto });
  }
}

export interface QueryApplicationDto {
  readonly name?: string;
}

export interface CreateApplicationDto {
  readonly name?: string;
}

export interface UpdateApplicationDto {
  readonly id: string;
  readonly name?: string;
}

export interface DeleteApplicationDto {
  readonly id: string;
}

export declare type ApplicationList = Array<Application>;

export interface Application {
  id: string;
  name: string;
}
