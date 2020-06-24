import axios from 'axios';

axios.defaults.baseURL = '/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).axios = axios;

export * from './auth';
export * from './profile';
