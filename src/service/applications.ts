import axios, { AxiosResponse } from 'axios';

import { FormModel } from '@/views/Form/Form';

export type ApplicationStatus = 'Designing' | 'Published' | 'Archive';

export class ApplicationsService {
  static getApplication(id: string): Promise<AxiosResponse<ApplicationVo>> {
    return axios.get(`applications/${id}`);
  }

  static getApplications(queryApplicationDto?: QueryApplicationDto): Promise<AxiosResponse<Array<Application>>> {
    return axios.get('applications', { params: queryApplicationDto });
  }

  static createApplication(createApplicationDto: CreateApplicationDto): Promise<AxiosResponse<void>> {
    return axios.post('applications', createApplicationDto);
  }

  static updateApplication(updateApplicationDto: UpdateApplicationDto): Promise<AxiosResponse<void>> {
    return axios.patch('applications', updateApplicationDto);
  }

  static deleteApplication(deleteApplicationDto: DeleteApplicationDto): Promise<AxiosResponse<void>> {
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
  readonly formModel?: FormModel;
  readonly status?: ApplicationStatus;
}

export interface DeleteApplicationDto {
  readonly id: string;
}

export declare type ApplicationList = Array<Application>;

export interface Application {
  id: string;
  name: string;
}

export interface ApplicationVo extends Application {
  status: string;
  creator: { id: string; name: string };
  lastModifier?: { id: string; name: string };
  formModel: FormModel;
}
