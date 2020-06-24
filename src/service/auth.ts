import axios from 'axios';

export class AuthService {
  static login(payload: LoginData) {
    return axios.post('auth/login', payload);
  }

  static loginOrganization(payload: LoginOrganizationData) {
    return axios.post('auth/organization', payload);
  }
}

interface LoginData {
  name: string;
  password: string;
}

interface LoginOrganizationData {
  organizationId: string;
}
