/**
 * 数据字典
 * Created by penghuicong on 2017/12/12.
 */
import { message } from 'antd';
import * as dictService from './service';

export default {
  namespace: 'dict',
  state: {
    loading: false,
    dictTypeList: [],
    dictList: [],
    typeId: 0,
    values: {},
    pageSize: 10,
    pageNum: 1,
    total: 0,
    pages: 0,
    addVisible: false,
  },
  reducers: {
    fetchLoading(state, { payload: loading }) {
      return {
        ...state,
        loading,
      };
    },
    fetchDictListSuccess(state, { payload: { data, typeId, values } }) {
      return {
        ...state,
        dictList: data.list,
        pageSize: data.pageSize,
        pageNum: data.pageNum,
        total: data.total,
        pages: data.pages,
        typeId,
        values,
      };
    },
    fetchSuccess(state, { payload: data }) {
      return {
        ...state,
        dictTypeList: data,
      };
    },
    showDictModal(state, action) {
      const { modalType } = action.payload;
      return {
        ...state,
        addVisible: true,
        modalType,
      };
    },
    hideDictModal(state) {
      return { ...state, addVisible: false };
    },
    setTypeId(state, { payload: { typeId } }) {
      return {
        ...state,
        typeId,
      };
    },
  },
  effects: {
    // 查询左边字典类型
    *fetchDictType(_, { call, put }) {
      // 显示loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用API
      const data = yield call(dictService.getDictTypeList);

      yield put({ type: 'fetchSuccess', payload: data });

      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 字典类型新增
    *addDictType({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(dictService.addDictType, postData);

      if (data.success) {
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        yield put({ type: 'fetchDictType' });
      } else {
        message.error(data.msg);
      }

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confrimLoading', payload: { confirmLoading: false } });
    },

    // 显示编辑弹框
    *showDictTypeEditModal({ payload: { type, id } }, { call, put }) {
      // 显示弹框
      yield put({ type: 'modal/showModal', payload: { type } });

      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(dictService.getDictTypeInfo, id);

      if (data.success) {
        yield put({ type: 'modal/setItem', payload: { curItem: data.obj } });
        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      } else {
        message.error(data.msg);
        yield put({ type: 'modal/hideModal' });
      }
    },

    // 提交编辑字典类型
    *editDictType({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(dictService.editDictType, postData);
      if (data.success) {
        yield put({ type: 'modal/hideModal' });
        message.success(data.msg);
        yield put({ type: 'fetchDictType' });
      } else {
        message.error(data.msg);
      }

      // 隐藏确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 删除字典类型
    *delDictType({ payload: id }, { call, put }) {
      // 显示loading
      yield put({ type: 'fetchLoading', payload: true });
      // 调用API
      const data = yield call(dictService.delDictType, id);
      if (data.success) {
        message.success(data.msg);
        yield put({ type: 'fetchDictType' });
      } else {
        message.error(data.msg);
      }
      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 获取字典数据
    *fetchDictList({ payload: { values, typeId, pageNum, pageSize } }, { call, put, select }) {
      // 显示查询区域loading
      yield put({ type: 'fetchLoading', payload: true });

      const dict = yield select(state => state.dict);

      const val = values || dict.values || {};
      const tid = typeId || dict.typeId || 0;

      // 调用查询api
      const data = yield call(dictService.getDictList,
        {
          ...val,
          pageNum: pageNum || dict.pageNum || 1,
          pageSize: pageSize || dict.pageSize || 10,
          typeId: tid,
        });

      if (data.success) {
        // 查询成功,setState
        yield put({ type: 'fetchDictListSuccess', payload: { data, values: val, typeId: tid } });
      } else {
        message.error(data.msg);
      }
      // 隐藏查询区域loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 点击栏目获取资讯列表
    *fetchDictListByType({ payload: { typeId, pageNum } }, { put }) {
      yield put({ type: 'setTypeId', payload: { typeId } });
      yield put({ type: 'fetchDictList', payload: { typeId, pageNum } });
    },

    // 显示新增字典数据弹框
    *showAddModal({ payload: modalType }, { put, call, select }) {
      yield put({ type: 'showDictModal', payload: modalType });

      // 显示confrimLoading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 读取字典类型
      const data = yield call(dictService.getDictTypeList);

      yield put({ type: 'fetchSuccess', payload: data });

      const dict = yield select(state => state.dict);

      yield put({ type: 'modal/setItem', payload: { curItem: { typeId: dict.values && dict.values.typeId } } });

      // 隐藏loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 新增字典数据
    *addDict({ payload: postData }, { call, put }) {
      // 显示confirmLoading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });

      // 调用API
      const data = yield call(dictService.addDict, postData);

      if (data.success) {
        yield put({ type: 'hideDictModal' });
        message.success(data.msg);

        // 查询
        yield put({ type: 'fetchDictList', payload: { } });
      } else {
        message.error(data.msg);
      }
    },

    // 显示编辑字典数据弹框
    *showEditModal({ payload: { modalType, id } }, { put, call }) {
      // 显示弹框
      yield put({ type: 'showDictModal', payload: { modalType } });

      // 显示confirmLoading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(dictService.getDictInfo, id);
      const dictTypeList = yield call(dictService.getDictTypeList);

      if (data.success) {
        // 将数据设置到curItem
        yield put({ type: 'modal/setItem', payload: { curItem: data.obj } });
        // 获取字典类型
        yield put({ type: 'fetchSuccess', payload: dictTypeList });
        // 隐藏确定按钮loading
        yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
      } else {
        message.error(data.msg);
        // 隐藏弹出框
        yield put({ type: 'hideDictModal' });
      }
    },

    // 编辑字典数据
    *editDict({ payload: postData }, { call, put }) {
      // 显示确定按钮loading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: true } });

      // 调用API
      const data = yield call(dictService.editDict, postData);
      if (data.success) {
        // 隐藏弹框
        yield put({ type: 'hideDictModal' });
        message.success(data.msg);

        // 查询
        yield put({ type: 'fetchDictList', payload: { } });
      } else {
        message.error(data.msg);
      }

      // 隐藏confirmLoading
      yield put({ type: 'modal/confirmLoading', payload: { confirmLoading: false } });
    },

    // 删除字典数据
    *delDict({ payload: id }, { call, put }) {
      // 显示Loading
      yield put({ type: 'fetchLoading', payload: true });
      // 调用API
      const data = yield call(dictService.delDict, id);
      if (data.success) {
        message.success(data.msg);

        // 查询
        yield put({ type: 'fetchDictList', payload: { } });
      } else {
        message.error(data.msg);
      }

      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 批量删除字典数据
    *batchDeleteDict({ payload: { ids, callback } }, { call, put }) {
      // 显示Loading
      yield put({ type: 'fetchLoading', payload: true });
      // 调用API
      const data = yield call(dictService.batchDelete, ids);

      if (data.success) {
        message.success(data.msg);

        // 查询
        yield put({ type: 'fetchDictList', payload: { } });
        // 执行回调
        callback && callback();
      } else {
        message.error(data.msg);
      }

      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },

    // 刷新缓存
    *refreshCache(_, { call, put }) {
      // 显示loading
      yield put({ type: 'fetchLoading', payload: true });

      // 调用API
      const data = yield call(dictService.refreshCache);

      if (data.success) {
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }

      // 隐藏loading
      yield put({ type: 'fetchLoading', payload: false });
    },
  },
};
