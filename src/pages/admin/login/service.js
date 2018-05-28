import { POST } from 'utils/request';

export function loginCheck(payload) {
  return POST('/login/', payload);
}

export function loginCheckMobile(payload) {
  return POST('/login/', payload);
}

export function logout() {
  return POST('/login/logout');
}
