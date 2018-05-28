/**
 * Created by chelin on 2017/12/4.
 */
import { message } from 'antd';
import _ from 'lodash';
import * as roleService from './service';

export default {
  namespace: 'role',
  state: {
    list: [],
    pageNum: 1,
    pageSize: 0,
    total: 0,
    loading: false,
    type: '', // 弹出框为新增保存还是为编辑保存
    ids: [], // 批量删除所存储的ids
    allMenu: [],
    roleMenus: [],
    values: {},
    tableLoading: true,
    rulesModalVisible: false, // 角色权限调整面板
  },

  reducers: {
    // 角色权限调整面板显示与隐藏
    rulesModalVisible(state, { payload: rulesModalVisible }) {
      return {
        ...state,
        rulesModalVisible,
      };
    },
    rulesModalSetItem(state, { payload: { tableLoading, allMenus, roleMenus, roleId } }) {
      return {
        ...state,
        tableLoading,
        allMenus,
        roleMenus,
        roleId,
      };
    },
    // 查询之前的loading
    fetchLoading(state, { payload: loading }) {
      return {
        ...state,
        loading,
      };
    },
    // 查询结果放入store
    fetchSuccess(state, { payload: { data, values } }) {
      return {
        ...state,
        pageSize: data.pageSize,
        pages: data.pages,
        pageNum: data.pageNum,
        total: data.total,
        list: data.list,
        values,
      };
    },
  },

  effects: {
    // 查询
    *fetch({ payload: { values, pageNum, pageSize } }, { call, put, select }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });

      const role = yield select(state => state.role);

      const val = values || role.values || {};

      // 调用查询api
      const data = yield call(roleService.fetch,
        {
          ...val,
          pageNum: pageNum || role.pageNum || 1,
          pageSize: pageSize || role.pageSize || 10,
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

    // 新增
    * add({ payload: values }, { call, put }) {
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });
      const data = yield call(roleService.add, values);
      if (data.success) {
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);

        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
      }
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 删除
    * delete({ payload: id }, { call, put }) {
      // 显示loading
      yield put({ type: 'fetchLoading', payload: true });
      // 调用删除api
      const data = yield call(roleService.del, id);
      if (data.success) {
        message.success(data.msg);

        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
      }
      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 批量删除
    * batchDelete({ payload: ids }, { call, put }) {
      yield put({ type: 'fetchLoading', payload: true });
      const data = yield call(roleService.batchDelete, ids);
      if (data.success) {
        message.success(data.msg);

        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
      }
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 编辑单条数据获取信息
    * showEditModal({ payload: { id, type } }, { call, put }) {
      // 显示modal
      yield put({ type: 'modal/showModal', payload: { type } });
      // 显示Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });
      // 调用api获取当前数据的信息
      const data = yield call(roleService.editInfo, id);
      // 将查询到的信息放入store中，并展示
      if (data.success) {
        yield put({ type: 'modal/setItem', payload: { curItem: data.obj } });
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      } else {
        message.error(data.msg);
        // 隐藏Modal的loading
        yield put({ type: 'modal/hideModal' });
      }
    },

    // 保存编辑
    * edit({ payload: values }, { put, call }) {
      // 显示Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });
      // 调用api
      const data = yield call(roleService.saveEditInfo, values);
      if (data.success) {
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);

        // 调用查询事件
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error(data.msg);
      }
      // 隐藏Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 进入角色权限调整页
    * showRulesModal({ payload: { id } }, { call, put, select }) {
      // 从state.role中取出全部菜单
      const role = yield select(state => state.role);
      let allMenus = role.allMenus || [];

      yield put({ type: 'rulesModalSetItem', payload: { tableLoading: true, allMenus, roleMenus: [], roleId: id } });

      // 显示modal
      yield put({ type: 'rulesModalVisible', payload: true });
      // 显示Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      if (!allMenus || _.isEmpty(allMenus)) {
        // 调用api获取所有菜单
        const data = yield call(roleService.allMenu);
        if (!data.success) {
          message.error(data.msg);
          // 隐藏Modal的loading
          yield put({ type: 'modal/hideModal' });
          return;
        }
        allMenus = data.obj;
      }

      // 调用api获取当前角色的所有菜单
      const curData = yield call(roleService.roleMenu, id);
      if (!curData.success) {
        message.error(curData.msg);
        // 隐藏Modal的loading
        yield put({ type: 'modal/hideModal' });
        return;
      }

      // 将查询到的信息放入store中，并展示
      yield put({ type: 'rulesModalSetItem', payload: { tableLoading: false, allMenus, roleMenus: curData.obj, roleId: id } });
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 保存角色权限
    * saveRoleRules({ payload: { roleId, resources } }, { call, put, select }) {
      // 从state.role中取出全部菜单
      const role = yield select(state => state.role);
      const allMenus = role.allMenus || [];
      yield put({ type: 'rulesModalSetItem', payload: { tableLoading: true, allMenus, roleMenus: resources, roleId } });

      // 显示Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });
      // 调用api
      const data = yield call(roleService.saveRoleResource, { roleId, resources });
      if (data.success) {
        yield put({ type: 'rulesModalVisible', payload: false });
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }
      // 隐藏Modal的loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },
  },
};
