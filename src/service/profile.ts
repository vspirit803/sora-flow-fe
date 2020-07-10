import axios from 'axios';

import { UpdateAccountDto } from './System';

export class ProfileService {
  static getOrganizations() {
    return axios.get('profile/organizations');
  }

  static leaveOrganization(payload?: { accountId?: string }) {
    return axios.delete('profile/organizations', { data: payload });
  }

  static getMenus() {
    return axios.get('profile/menus');
  }

  static getProfileOrganization() {
    return axios.get('profile/organization');
  }

  static getAccounts() {
    return axios.get('profile/accounts');
  }

  static updateAccount(payload: UpdateAccountDto) {
    return axios.patch('profile/accounts', payload);
  }
}
