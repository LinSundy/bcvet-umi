/**
 * Created by penghuicong on 2017/11/30.
 */
import { GET, POST, DELETE, PUT } from 'utils/request';

export function getList() {
  return GET('/resource/tree/list');
}
export function add(postData) {
  return POST('/resource', postData);
}
export function getInfo(id) {
  return GET(`/resource/${id}`);
}
export function edit(postData) {
  return PUT('/resource', postData);
}
export function del(id) {
  return DELETE(`/resource/${id}`);
}
export function findNode() {
  return GET('/resource/select/list');
}

