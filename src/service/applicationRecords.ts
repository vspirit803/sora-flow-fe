import axios, { AxiosResponse } from 'axios';

import { FormModel, FormValue } from '@/views/Form/Form';

export class ApplicationRecordsService {
  static getApplicationRecords(
    applicationId: string,
    queryApplicationRecordDto?: QueryApplicationRecordDto,
  ): Promise<AxiosResponse<Array<ApplicationRecord>>> {
    return axios.get(`applications/${applicationId}/records`, { data: queryApplicationRecordDto });
  }

  static createApplicationRecord(applicationId: string, createApplicationRecordDto: CreateApplicationRecordDto) {
    console.log(createApplicationRecordDto);
    // return axios.post(`applications/${applicationId}/records`, createApplicationRecordDto);
  }

  static updateApplicationRecord(applicationId: string, updateApplicationRecordDto: UpdateApplicationRecordDto) {
    return axios.patch(`applications/${applicationId}/records`, updateApplicationRecordDto);
  }

  static deleteApplicationRecord(applicationId: string, deleteApplicationRecordDto: DeleteApplicationRecordDto) {
    return axios.delete(`applications/${applicationId}/records`, { data: deleteApplicationRecordDto });
  }
}

export interface QueryApplicationRecordDto {
  readonly id?: string;
  readonly application?: string;
  readonly account?: string;
  readonly organization?: string;
}

export interface CreateApplicationRecordDto {
  readonly data: FormValue;
}

export interface UpdateApplicationRecordDto {
  readonly id: string;
  readonly name?: string;
  readonly formModel?: FormModel;
}

export interface DeleteApplicationRecordDto {
  readonly id: string;
}

export interface ApplicationRecord {
  id: string;
  application: string;
  account: string;
  organization: string;
  data: FormValue;
}
