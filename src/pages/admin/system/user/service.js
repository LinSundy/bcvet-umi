import { GET, POST, PUT, DELETE, COMPLEX_POST, COMPLEX_DELETE, FILE_POST } from 'utils/request';

export function fetch(params) {
  return GET('/user/list', params);
}
export function del(id) {
  return DELETE(`/user/${id}`);
}
export function batchDelete(ids) {
  return COMPLEX_DELETE('/user/list', ids);
}
export function add(postData) {
  return POST('/user', postData);
}
export function edit(postData) {
  return PUT('/user', postData);
}
export function info(id) {
  return GET(`/user/${id}`);
}
export function updateStatus({ id, status }) {
  return PUT(`/user/${id}/status`, { status });
}
export function resetPwd(id) {
  return PUT(`/user/${id}/password`);
}
export function roles(userId) {
  return GET(`/user/${userId}/roles`);
}
export function saveUserRole({ userId, roleIds }) {
  return COMPLEX_POST(`/user/${userId}/roles`, roleIds);
}
export function importUser(formData) {
  return FILE_POST('/user/excel', formData);
}
export function saveModifyPwd(value) {
  return PUT('/user/password', value);
}
