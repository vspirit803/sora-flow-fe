import axios from 'axios';

export class AccountsService {
  static getAccounts() {
    return axios.get('accounts');
  }

  static getAccountDetail(id: string) {
    return axios.get(`accounts/${id}`);
  }

  static updateAccount(updateAccountDto: UpdateAccountDto) {
    return axios.patch('accounts', updateAccountDto);
  }

  static createAccount(createAccountDto: CreateAccountDto) {
    return axios.post('accounts', createAccountDto);
  }

  static deleteAccount(deleteAccountDto: DeleteAccountDto) {
    return axios.delete('accounts', { data: deleteAccountDto });
  }
}

export interface CreateAccountDto {
  readonly name: string;
  readonly nickname: string;
  readonly roles?: Array<string>;
  readonly password: string;
}

export interface UpdateAccountDto {
  readonly id: string;
  readonly name?: string;
  readonly nickname?: string;
  readonly roles?: Array<string>;
  readonly password?: string;
}

export interface DeleteAccountDto {
  readonly id: string;
}

export interface Account {
  id: string;
  name: string;
  nickname: string;
}
