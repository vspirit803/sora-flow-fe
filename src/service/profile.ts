import axios from 'axios';

export class ProfileService {
  static getOrganizations() {
    return axios.get('profile/organizations');
  }
}
