import { routerRedux } from 'dva/router';
import { setPermissions } from 'components/Authorized/auth';
import * as loginService from './service';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  namespace: 'login',

  state: {
    success: true,
    loginType: 'account',
    msg: '',
    submitting: false,
  },

  effects: {
    *accountSubmit({ payload, callback }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(loginService.loginCheck, payload);
      if (response && response.success) {
        if (response.obj) {
          setPermissions(response.obj);
          yield put({ type: 'loginHandle', payload: { ...response, success: true, msg: '', loginType: 'account' } });
          yield put({ type: 'changeSubmitting', payload: false });
          yield put({ type: 'global/loginFlagToggle', payload: true });
          yield put(routerRedux.push('/admin'));
        } else {
          yield call(delay, 1000);
          yield put({ type: 'loginHandle', payload: { ...response, success: false, msg: '无后台访问权限', loginType: 'account' } });
          yield put({ type: 'changeSubmitting', payload: false });

          callback && callback();
        }
      } else {
        yield call(delay, 1000);
        yield put({ type: 'loginHandle', payload: { ...response, loginType: 'account' } });
        yield put({ type: 'changeSubmitting', payload: false });

        callback && callback();
      }
    },

    *mobileSubmit({ payload, callback }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(loginService.loginCheckMobile, payload);
      if (response && response.success) {
        if (response.obj) {
          setPermissions(response.obj);
          yield put({ type: 'loginHandle', payload: { ...response, success: true, msg: '', loginType: 'mobile' } });
          yield put({ type: 'changeSubmitting', payload: false });
          yield put({ type: 'global/loginFlagToggle', payload: true });
          yield put(routerRedux.push('/admin'));
        } else {
          yield call(delay, 1000);
          yield put({ type: 'loginHandle', payload: { ...response, success: false, msg: '无后台访问权限', loginType: 'mobile' } });
          yield put({ type: 'changeSubmitting', payload: false });

          callback && callback();
        }
      } else {
        yield call(delay, 1000);
        yield put({ type: 'loginHandle', payload: { ...response, loginType: 'mobile' } });
        yield put({ type: 'changeSubmitting', payload: false });

        callback && callback();
      }
    },

  },

  reducers: {
    loginHandle(state, { payload }) {
      return {
        ...state,
        success: payload.success,
        msg: payload.msg,
        loginType: payload.loginType,
      };
    },
    changeLoginType(state, { payload: { loginType } }) {
      return {
        ...state,
        loginType,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
