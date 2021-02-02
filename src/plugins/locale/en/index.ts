import { LocaleType } from '../LocaleType';
import { account } from './account';
import { menu } from './menu';
import { organization } from './organization';
import { role } from './role';
import { task } from './task';
import { version } from './version';

const en: LocaleType = {
  login: 'login',
  language: 'English',
  logout: 'logout',
  selectOrgainzation: 'select an organization',
  confirm: 'confirm',
  cancel: 'cancel',
  refresh: 'refresh',
  update: 'update',
  delete: 'delete',
  add: 'add',
  submit: 'submit',
  actions: 'actions',
  organization: organization,
  account: account,
  menu: menu,
  role: role,
  version: version,
  task: task,
};

export { en };
