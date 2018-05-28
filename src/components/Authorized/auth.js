import _ from 'lodash';

let permissions; // 缓存 localStorage.getItem('permissions') 数据

export const setPermissions = (perms) => {
  localStorage.setItem('permissions', JSON.stringify(perms));
  permissions = perms;
};

export const isPermitted = (curPermission) => {
  if (!permissions) {
    permissions = JSON.parse(localStorage.getItem('permissions'));
  }
  return _.includes(permissions, curPermission);
};
