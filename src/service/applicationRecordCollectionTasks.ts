import axios, { AxiosResponse } from 'axios';

export class ApplicationRecordCollectionTasksService {
  static getApplicationRecordCollectionTasks(queryTaskDto?: QueryTaskDto): Promise<AxiosResponse<Array<Task>>> {
    return axios.get('tasks', { data: queryTaskDto });
  }

  static createApplicationRecordCollectionTask(createTaskDto: CreateTaskDto): Promise<AxiosResponse> {
    return axios.post('tasks', createTaskDto);
  }

  static updateApplicationRecordCollectionTask(updateTaskDto: UpdateTaskDto): Promise<AxiosResponse> {
    return axios.patch('tasks', updateTaskDto);
  }

  static deleteApplicationRecordCollectionTask(deleteTaskDto: DeleteTaskDto): Promise<AxiosResponse> {
    return axios.delete('tasks', { data: deleteTaskDto });
  }
}

export interface QueryTaskDto {
  readonly id?: string;
  readonly organization?: string;
  readonly account?: string;
  readonly type?: string;
  readonly status?: string;
  readonly metadata?: Record<string, string>;
}

export interface CreateTaskDto {
  readonly organization?: string;
  readonly account?: string;
  readonly type: string;
  readonly status?: string;
  readonly finalTime: Date;
  readonly metadata: Record<string, string>;
}

export interface UpdateTaskDto {
  readonly id: string;
  readonly status: string;
}

export interface DeleteTaskDto {
  readonly id: string;
}

export interface Task {
  id: string;
  organization: string;
  account: string;
  type: string;
  status: string;
  finalTime: Date;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
