import axios, { AxiosResponse } from 'axios';

export class TasksService {
  static getTasks(queryTaskDto?: QueryTaskDto): Promise<AxiosResponse<Array<Task>>> {
    return axios.get('tasks', { params: queryTaskDto });
  }

  static createTask(createTaskDto: CreateTaskDto): Promise<AxiosResponse> {
    return axios.post('tasks', createTaskDto);
  }

  static updateTask(updateTaskDto: UpdateTaskDto): Promise<AxiosResponse> {
    return axios.patch('tasks', updateTaskDto);
  }

  static deleteTask(deleteTaskDto: DeleteTaskDto): Promise<AxiosResponse> {
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

export interface ApplicationRecordReportTask extends Task {
  type: 'ApplicationRecordReport';
  metadata: {
    application: string;
    applicationRecordCollectionTask: string;
    title: string;
    applicationRecord: string;
  };
}
