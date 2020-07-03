import axios from 'axios';

export class MenuService {
  static getMenus() {
    return axios.get('menus');
  }

  static createMenu(createMenuDto: CreateMenuDto) {
    return axios.post('menus', createMenuDto);
  }

  static updateMenu(updateMenuDto: UpdateMenuDto) {
    return axios.patch('menus', updateMenuDto);
  }

  static deleteMenu(deleteMenuDto: DeleteMenuDto) {
    return axios.delete('menus', { data: deleteMenuDto });
  }
}

export interface CreateMenuDto {
  readonly name: string;
  readonly icon?: string;
  readonly type: 'directory' | 'item';
  readonly url?: string;
  readonly parentId?: string;
}

export interface UpdateMenuDto {
  readonly id: string;
  readonly name: string;
  readonly icon?: string;
  readonly url?: string;
  readonly parentId?: string;
}

export interface DeleteMenuDto {
  readonly id: string;
}

export interface Menu {
  id: string;
  name: string;
  namePath: Array<string>;
  idPath: Array<string>;
  parentId: string;
  parentName: string;
  icon: string;
  url: string;
  enable: boolean;
  type: 'directory' | 'item';
  visible: boolean;
}

export interface MenuTreeItem extends Menu {
  children: Array<MenuTreeItem>;
}

// export type MenuTreeItem = {
//   children: Array<MenuTreeItem>;
// } & {
//   [P in keyof Menu]: Menu[P];
// };
