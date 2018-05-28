/**
 * Created by penghuicong on 2017/11/30.
 */
import { message } from 'antd';
import * as menuService from './service';

export default {
  namespace: 'menu',
  state: {
    list: [],
    parentList: [], // 父级菜单列表
    loading: false,
  },
  reducers: {
    fetchSuccess(state, { payload: data }) {
      return {
        ...state,
        list: data,
      };
    },
    fetchLoading(state, { payload: loading }) {
      return {
        ...state,
        loading,
      };
    },
    getSuccess(state, { payload: data }) {
      return {
        ...state,
        parentList: data,
      };
    },
  },
  effects: {
    // 查询列表
    *fetch(_, { call, put }) {
      // 显示查询区域Loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用查询API
      const data = yield call(menuService.getList);

      yield put({ type: 'fetchSuccess', payload: data });

      // 隐藏查询区域Loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 显示新增菜单弹框
    *showAddModal({ payload: { id, type } }, { call, put }) {
      // 显示弹框
      yield put({ type: 'modal/showModal', payload: { type } });

      const obj = { pid: id };
      yield put({ type: 'modal/setItem', payload: { curItem: obj } });

      const data = yield call(menuService.findNode);
      yield put({ type: 'getSuccess', payload: data });
    },

    // 新增菜单提交
    *add({ payload: postData }, { call, put }) {
      // 显示Loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });
      // 调用新增API
      const data = yield call(menuService.add, postData);
      if (data.success) {
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        yield put({ type: 'fetch' });
      } else {
        message.error(data.msg);
      }

      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 显示编辑框
    *showEditModal({ payload: { id, type } }, { call, put }) {
      // 显示弹框
      yield put({ type: 'modal/showModal', payload: { type } });

      // 显示确定按钮Loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(menuService.getInfo, id);
      const nodeList = yield call(menuService.findNode);
      if (data.success) {
        yield put({ type: 'modal/setItem', payload: { curItem: data.obj } });
        yield put({ type: 'getSuccess', payload: nodeList });
        // 隐藏确定按钮Loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      } else {
        message.error(data.msg);
        yield put({ type: 'modal/hideModal' });
      }
    },

    // 提交编辑内容
    *edit({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(menuService.edit, postData);
      if (data.success) {
        // 隐藏弹框
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        yield put({ type: 'fetch' });
      } else {
        message.error(data.msg);
      }

      // 隐藏确定按钮Loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 删除菜单
    *del({ payload: id }, { call, put }) {
      // 显示Loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用api
      const data = yield call(menuService.del, id);
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'fetch' });
      } else {
        message.error(data.msg);
      }

      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },
  },
  subscriptions: {},
};
