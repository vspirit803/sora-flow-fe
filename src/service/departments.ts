import axios, { AxiosResponse } from 'axios';

export class DepartmentsService {
  static getDepartment(id: string): Promise<AxiosResponse<Department>> {
    return axios.get(`departments/${id}`);
  }

  static getDepartments(queryDepartmentDto?: QueryDepartmentDto): Promise<AxiosResponse<Array<DepartmentVo>>> {
    return axios.get('departments', { params: queryDepartmentDto });
  }

  static createDepartment(createDepartmentDto: CreateDepartmentDto) {
    return axios.post('departments', createDepartmentDto);
  }

  static updateDepartment(updateDepartmentDto: UpdateDepartmentDto) {
    return axios.patch('departments', updateDepartmentDto);
  }

  static deleteDepartment(deleteDepartmentDto: DeleteDepartmentDto) {
    return axios.delete('departments', { data: deleteDepartmentDto });
  }

  static findMembers(id: string) {
    return axios.get(`departments/${id}/members`);
  }

  static addMembers(id: string, members: Array<string>) {
    return axios.post(`departments/${id}/members`, { members });
  }

  static removeMember(id: string, member: string) {
    return axios.delete(`departments/${id}/members/${member}`);
  }
}

export interface QueryDepartmentDto {
  readonly id?: string;
  readonly name?: string;
  readonly supervisor?: string;
}

export interface CreateDepartmentDto {
  readonly name: string;
  readonly supervisor: string;
  readonly parentId?: string;
}

export interface UpdateDepartmentDto {
  readonly id: string;
  readonly name?: string;
  readonly supervisor?: string;
}

export interface DeleteDepartmentDto {
  readonly id: string;
}

export interface Department {
  id: string;
  name: string;
  namePath: Array<string>;
  idPath: Array<string>;
  parentId: string;
  parentName: string;
  organization: string;
  supervisor: string;
  members: Array<string>;
}

export interface DepartmentVo {
  id: string;
  parentId: string;
  name: string;
  supervisor: string;
  children: Array<DepartmentVo>;
}
