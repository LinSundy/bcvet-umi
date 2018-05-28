import axios from 'axios';
import qs from 'qs';
import { notification } from 'antd';
import router from 'umi/router';
import _ from 'lodash';

window.site_title = '百年视野';
window.api_host = Globals.API_HOST;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '无权访问',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

axios.interceptors.request.use((c) => {
  const config = c;
  // NProgress.start();
  config.url = _.startsWith(config.url, 'http:') ? config.url : window.api_host + config.url;
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  // config.data = qs.stringify(config.data);
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  // NProgress.done();
  return response;
}, (err) => {
  const error = err;

  if (error.response) {
    const { status } = error.response;
    if (status === 401 || status === 403 || status === 408 || status === 501) {
      const sessionStatus = error.response.headers['session-status'];
      if (sessionStatus) {
        if (sessionStatus === 'SESSION-LOGOUT') { // 未登录
          window.g_app._store.dispatch({
            type: 'global/adminLogout',
          });
        } else if (sessionStatus === 'SESSION-KICKOUT') { // 未登录
          window.g_app._store.dispatch({
            type: 'global/adminLogout',
          });
          notification.error({
            message: '您的账号已在其他地方登录，请重新登录',
          });
        } else if (sessionStatus === 'UNAUTH-ACCESS') { // 无权访问
          router.push('/403');
        } else if (sessionStatus === 'DUPLICATE-SUBMIT') { // 3s内重复提交
          error.response.data = { success: false, msg: '操作过于频繁，请稍后再试!' };
          return error.response;
        } else if (sessionStatus === 'WEB-SESSION-LOGOUT') {
          window.g_app._store.dispatch({
            type: 'global/adminLogout',
          });
        } else if (sessionStatus === 'WEB-SESSION-KICKOUT') {
          notification.error({
            message: '您的账号已在其他地方登录，请重新登录',
          });
          window.g_app._store.dispatch({
            type: 'global/adminLogout',
          });
        }
      }
    } else {
      notification.error({
        message: codeMessage[status],
      });
    }
    return Promise.reject(error);
  }

  notification.error({
    message: '系统异常，请稍后再试',
  });
  return Promise.reject(error);
});

function checkStatus(response) {
  if (response && (response.status === 200 || response.status === 304 || response.status === 501)) {
    return response.data;
  }
}

export const request = (config) => {
  return axios.request(config).then(checkStatus);
};

export const GET = (url, data, config) => {
  const CONF = {
    url,
    method: 'get',
    params: data,
  };
  return request({ ...CONF, ...config });
};

export const POST = (url, data, config) => {
  const CONF = {
    url,
    method: 'post',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    data: qs.stringify(data),
  };
  return request({ ...CONF, ...config });
};

export const COMPLEX_POST = (url, data, config) => {
  const CONF = {
    url,
    method: 'post',
    'Content-Type': 'application/json',
    data,
  };
  return request({ ...CONF, ...config });
};

export const FILE_POST = (url, data, config) => {
  const CONF = {
    url,
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data,
  };
  return request({ ...CONF, ...config });
};

export const PUT = (url, data, config) => {
  const CONF = {
    url,
    method: 'put',
    data: qs.stringify(data),
  };
  return request({ ...CONF, ...config });
};

export const COMPLEX_PUT = (url, data, config) => {
  const CONF = {
    url,
    method: 'put',
    'Content-Type': 'application/json',
    data,
  };
  return request({ ...CONF, ...config });
};

export const DELETE = (url, data, config) => {
  const CONF = {
    url,
    method: 'delete',
    data,
  };
  return request({ ...CONF, ...config });
};

export const COMPLEX_DELETE = (url, data, config) => {
  const CONF = {
    url,
    method: 'delete',
    'Content-Type': 'application/json',
    data,
  };
  return request({ ...CONF, ...config });
};
