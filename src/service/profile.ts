import axios from 'axios';

export class ProfileService {
  static getOrganizations() {
    return axios.get('profile/organizations');
  }

  static getMenus() {
    return axios.get('profile/menus');
  }
}
