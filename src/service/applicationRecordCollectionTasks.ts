import axios, { AxiosResponse } from 'axios';

import { Task } from './tasks';

export class ApplicationRecordCollectionTasksService {
  static getApplicationRecordCollectionTasks(
    queryApplicationRecordCollectionTaskDto?: QueryApplicationRecordCollectionTaskDto,
  ): Promise<AxiosResponse<Array<ApplicationRecordCollectionTask>>> {
    return axios.get('application-record-collection-tasks', { params: queryApplicationRecordCollectionTaskDto });
  }

  static getApplicationRecordCollectionTaskInfo(id: string): Promise<AxiosResponse<ApplicationRecordCollectionTask>> {
    return axios.get(`application-record-collection-tasks/${id}`);
  }

  static createApplicationRecordCollectionTask(
    createApplicationRecordCollectionTaskDto: CreateApplicationRecordCollectionTaskDto,
  ): Promise<AxiosResponse> {
    return axios.post('application-record-collection-tasks', createApplicationRecordCollectionTaskDto);
  }

  static updateApplicationRecordCollectionTask(
    updateApplicationRecordCollectionTaskDto: UpdateApplicationRecordCollectionTaskDto,
  ): Promise<AxiosResponse> {
    return axios.patch('application-record-collection-tasks', updateApplicationRecordCollectionTaskDto);
  }

  static deleteApplicationRecordCollectionTask(
    deleteApplicationRecordCollectionTaskDto: DeleteApplicationRecordCollectionTaskDto,
  ): Promise<AxiosResponse> {
    return axios.delete('application-record-collection-tasks', { data: deleteApplicationRecordCollectionTaskDto });
  }
}

export interface QueryApplicationRecordCollectionTaskDto {
  readonly id?: string;
  readonly organization?: string;
  readonly account?: string;
  readonly type?: string;
  readonly status?: string;
  readonly metadata?: Record<string, string>;
}

export interface CreateApplicationRecordCollectionTaskDto {
  readonly organization?: string;
  readonly account?: string;
  readonly type: string;
  readonly status?: string;
  readonly finalTime: Date;
  readonly metadata: Record<string, string>;
}

export interface UpdateApplicationRecordCollectionTaskDto {
  readonly id: string;
  readonly status: string;
}

export interface DeleteApplicationRecordCollectionTaskDto {
  readonly id: string;
}

export interface ApplicationRecordCollectionTask {
  task: Task;
}
