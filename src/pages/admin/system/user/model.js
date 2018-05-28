import { message, Modal } from 'antd';
import * as userService from './service';

const { confirm } = Modal;

export default {
  namespace: 'user',
  state: {
    pageNum: 1,
    pageSize: 0,
    pages: 0,
    total: 0,
    list: [],
    loading: false,
    values: {},
    roleModalVisible: false,
    roleModalData: {},
    importModalVisible: false,
    modifyPwdModalVisible: false,
  },

  reducers: {
    fetchSuccess(state, { payload: { data, values } }) {
      return {
        ...state,
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        pages: data.pages,
        total: data.total,
        list: data.list,
        values,
      };
    },
    fetchLoading(state, { payload: loading }) {
      return {
        ...state,
        loading,
      };
    },
    toggleRoleModal(state, { payload: roleModalVisible }) {
      return {
        ...state,
        roleModalVisible,
      };
    },
    setRoleModalData(state, { payload: roleModalData }) {
      return {
        ...state,
        roleModalData,
      };
    },
    toggleImportModal(state, { payload: importModalVisible }) {
      return {
        ...state,
        importModalVisible,
      };
    },
    toggleModifyPwdModal(state, { payload: modifyPwdModalVisible }) {
      return {
        ...state,
        modifyPwdModalVisible,
      };
    },
  },

  effects: {
    // 查询
    *fetch({ payload: { values, pageNum, pageSize } }, { call, put, select }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });

      const user = yield select(state => state.user);

      const val = values || user.values || {};

      // 调用查询api
      const data = yield call(userService.fetch,
        {
          ...val,
          pageNum: pageNum || user.pageNum || 1,
          pageSize: pageSize || user.pageSize || 10,
        });

      if (data.success) {
        // 查询成功,setState
        yield put({ type: 'fetchSuccess', payload: { data, values: val } });
      } else {
        message.error(data.msg);
      }

      // 隐藏查询区域loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 删除
    *delete({ payload: id }, { call, put }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用删除api
      const data = yield call(userService.del, id);
      if (data.success) {
        message.success(data.msg);
        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);

        // 隐藏查询区域loading
        yield put({ type: 'fetchLoading', payload: false });
      }
    },

    // 批量删除
    *batchDelete({ payload: ids, callback }, { call, put }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });
      // 调用批量删除api
      const data = yield call(userService.batchDelete, ids);
      if (data.success) {
        message.success(data.msg);
        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });

        // 调用回调，清除多选框
        callback && callback();
      } else {
        message.error(data.msg);

        // 隐藏查询区域loading
        yield put({ type: 'fetchLoading', payload: false });
      }
    },

    // 新增
    *add({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用新增api
      const data = yield call(userService.add, postData);
      if (data.success) {
        // 隐藏新增框
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        // 调用查询事件
        yield put({ type: 'fetch', payload: { pageNum: 1 } });
      } else {
        message.error(data.msg);
      }
      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 显示编辑框
    *showEditModal({ payload: { id, type } }, { call, put }) {
      // 显示编辑框
      yield put({ type: 'modal/showModal', payload: { type } });

      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用查询api，查询用户信息
      const data = yield call(userService.info, id);
      if (data.success) {
        // 将用户信息赋值到编辑框
        yield put({ type: 'modal/setItem', payload: { curItem: data.obj } });

        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      } else {
        message.error(data.msg);
        // 隐藏编辑框
        yield put({ type: 'modal/hideModal' });
      }
    },

    // 编辑
    *edit({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用编辑api
      const data = yield call(userService.edit, postData);
      if (data.success) {
        // 隐藏编辑框
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
      }

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 启用禁用
    *status({ payload: { id, status } }, { call, put }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用启用禁用api
      const data = yield call(userService.updateStatus, { id, status });
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
        // 隐藏查询区域loading
        yield put({ type: 'fetchLoading', payload: false });
      }
    },

    // 初始化密码
    *resetPwd({ payload: id }, { call }) {
      // 调用初始化密码api
      const data = yield call(userService.resetPwd, id);
      if (data.success) {
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }
    },

    // 显示授权表单
    *showRoleModal({ payload: userId }, { call, put }) {
      // 显示授权表单
      yield put({ type: 'toggleRoleModal', payload: true });

      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用查询api，查询用户全部角色，并标注已分配角色（checked=true）
      const roles = yield call(userService.roles, userId);
      // 转换成key-title
      const allRoles = roles.map((item) => { return { key: item.id, title: item.roleName }; });
      // 从所有角色中找出已分配的角色
      const selectRoleIds = roles.filter(item => item.checked).map(item => item.id);

      // 设置授权表单内容
      yield put({ type: 'setRoleModalData', payload: { allRoles, selectRoleIds, userId } });

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 隐藏授权表单
    *hiddenRoleModal(_, { put }) {
      // 隐藏授权表单
      yield put({ type: 'toggleRoleModal', payload: false });

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 保存用户授权
    *saveUserRole({ payload: { userId, roleIds } }, { call, put, select }) {
      // 从state中取出数据
      const roleModalData = yield select(state => state.user.roleModalData);
      roleModalData.selectRoleIds = roleIds;
      // 设置授权表单内容
      yield put({ type: 'setRoleModalData', payload: roleModalData });

      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用保存用户授权api
      const data = yield call(userService.saveUserRole, { userId, roleIds });
      if (data.success) {
        // 隐藏授权表单
        message.success(data.msg);
        yield put({ type: 'hiddenRoleModal' });
      } else {
        message.error(data.msg);
        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      }
    },

    // 显示用户导入表单
    *showImportModal(_, { put }) {
      // 显示授权表单
      yield put({ type: 'toggleImportModal', payload: true });
    },

    // 隐藏用户导入表单
    *hiddenImportModal(_, { put }) {
      // 隐藏授权表单
      yield put({ type: 'toggleImportModal', payload: false });

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 用户导入保存
    *importUser({ payload: formData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用用户导入保存api
      const data = yield call(userService.importUser, formData);
      if (data.success) {
        // 隐藏授权表单
        message.success(data.msg);
        yield put({ type: 'hiddenImportModal' });
        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        if (data.obj && data.obj !== 'undefined') {
          confirm({
            title: data.msg,
            okText: '下载',
            onOk() {
              window.open(`${window.api_host}/user/excel/download?downloadPath=${encodeURI(data.obj)}`, '_blank');
            },
          });
        } else {
          message.error(data.msg);
        }
        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      }
    },

    // 显示修改密码弹出框
    *showModifyPwdModal(_, { put }) {
      // 显示修改密码弹出框
      yield put({ type: 'toggleModifyPwdModal', payload: true });
    },

    // 隐藏修改密码弹出框
    *hiddenModifyPwdModal(_, { put }) {
      // 隐藏授修改密码弹出框
      yield put({ type: 'toggleModifyPwdModal', payload: false });

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 保存修改密码
    * saveModifyPwd({ payload: values }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用保存修改密码api
      const data = yield call(userService.saveModifyPwd, values);
      if (data.success) {
        // 隐藏修改密码弹出框
        message.success(data.msg);
        yield put({ type: 'hiddenModifyPwdModal' });
      } else {
        message.error(data.msg);
        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      }
    },
  },
  subscriptions: {},
};
