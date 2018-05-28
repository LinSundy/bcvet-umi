import { routerRedux } from 'dva/router';
import Cookie from 'utils/cookie';
import * as loginService from 'pages/admin/login/service';

export default {
  namespace: 'global',

  state: {
    loginFlag: false,
    collapsed: false,
    currentUser: {},
  },

  effects: {

    // 从cookie读取当前登录用户
    * fetchCurrent(_, { put }) {
      const currentUser = {
        userId: Cookie.get('userId'),
        username: Cookie.get('username'),
        realname: Cookie.get('realname'),
      };
      if (currentUser.userId) {
        yield put({ type: 'loginFlagToggle', payload: true });
        yield put({ type: 'fetchCurrentSuccess', payload: currentUser });
      } else {
        yield put({ type: 'loginFlagToggle', payload: false });
        yield put({ type: 'fetchCurrentSuccess', payload: null });
      }
    },

    // 退出后台管理
    * adminLogout(_, { put, call }) {
      yield put({ type: 'fetchCurrentSuccess', payload: null });
      yield put({ type: 'loginFlagToggle', payload: false });
      yield call(loginService.logout);
      yield put(routerRedux.push('/admin/login'));
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    loginFlagToggle(state, { payload }) {
      return {
        ...state,
        loginFlag: payload,
      };
    },
    fetchCurrentSuccess(state, { payload: currentUser }) {
      return {
        ...state,
        currentUser,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
