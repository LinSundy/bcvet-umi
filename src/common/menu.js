import { isUrl } from 'utils/utils';
import { check } from 'components/Authorized/Authorized';

const menuData = [{
  name: '系统管理',
  icon: 'windows',
  path: 'admin/system',
  auth: 'system:manage',
  children: [{
    name: '用户管理',
    path: 'user',
    auth: 'user:manage',
  }, {
    name: '角色管理',
    path: 'role',
    auth: 'role:manage',
  }, {
    name: '菜单管理',
    path: 'menu',
    auth: 'resource:manage',
  }, {
    name: '数据字典',
    path: 'dict',
    auth: 'dict:manage',
  },
  ],
},
];

function formatter(data, parentPath = '/', parentAuth) {
  const datas = [];
  data.forEach((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      auth: item.auth || parentAuth,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.auth);
    }
    if (check(true, item.auth, false)) {
      datas.push(result);
    }
  });

  return datas;
}

export const getMenuData = () => formatter(menuData);

function formatterBreadcrumb(data) {
  return data.reduce((result, current) => {
    let childrenResult = {};
    if (current.children) {
      childrenResult = formatterBreadcrumb(current.children);
    }
    return {
      ...result,
      [current.path]: {
        name: current.name,
      },
      ...childrenResult,
    };
  }, {});
}

export const getBreadcrumbNameMap = () => formatterBreadcrumb(getMenuData(menuData));
