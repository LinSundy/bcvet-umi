/**
 * Created by chelin on 2017/12/4.
 */
import { GET, POST, PUT, DELETE, COMPLEX_DELETE, COMPLEX_POST } from 'utils/request';

// 查询
export function fetch(payload) {
  return GET('/role/list', payload);
}

// 新增
export function add(payload) {
  return POST('/role', payload);
}

// 删除
export function del(id) {
  return DELETE(`/role/${id}`);
}

// 批量删除
export function batchDelete(ids) {
  return COMPLEX_DELETE('/role/list', ids);
}

// 编辑单条数据
export function editInfo(id) {
  return GET(`/role/${id}`);
}

// 编辑数据保存
export function saveEditInfo(payload) {
  return PUT('/role', payload);
}

// 查询资源列表
export function allMenu() {
  return GET('/resource/all');
}

// 查询当前用户拥有的资源列表
export function roleMenu(roleId) {
  return GET(`/role/${roleId}/resources`);
}

// 保存角色权限
export function saveRoleResource({ roleId, resources }) {
  return COMPLEX_POST(`/role/${roleId}/resources`, resources);
}
