import axios from 'axios';

export class RolesService {
  static getRoles() {
    return axios.get('profile/roles');
  }

  static getRoleDetail(id: string) {
    return axios.get(`roles/${id}`);
  }

  static updateRole(updateRoleDto: UpdateRoleDto) {
    return axios.patch('roles', updateRoleDto);
  }

  static createRole(createRoleDto: CreateRoleDto) {
    return axios.post('roles', createRoleDto);
  }

  static deleteRole(deleteRoleDto: DeleteRoleDto) {
    return axios.delete('roles', { data: deleteRoleDto });
  }
}

export interface CreateRoleDto {
  readonly name?: string;
  readonly text?: string;
}

export interface UpdateRoleDto {
  readonly id: string;
  readonly name?: string;
  readonly text?: string;
  readonly authorizedOperations?: Array<string>;
  readonly organizationId?: string;
}

export interface DeleteRoleDto {
  readonly id: string;
}

export interface Role {
  id: string;
  name: string;
  text: string;
  /**授权操作列表 */
  authorizedOperations: Array<string>;
  type: 'normal' | 'version';
  organizationId: string;
}
