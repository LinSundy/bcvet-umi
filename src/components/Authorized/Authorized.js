import React from 'react';
import { isPermitted } from './auth';

export const check = (target, auth, noAuth) => {
  if (!auth) {
    return target;
  }
  // 数组处理
  if (Array.isArray(auth)) {
    const hasAuth = auth.some((item) => {
      return isPermitted(item);
    });

    return hasAuth ? target : noAuth;
  }

  // string 处理
  if (typeof auth === 'string') {
    if (isPermitted(auth)) {
      return target;
    }
    return noAuth;
  }

  // throw new Error('unsupported parameters');
  return noAuth;
};

class Authorized extends React.Component {
  render() {
    const { children, auth, noAuth = null } = this.props;
    return check(children, auth, noAuth);
  }
}

export default Authorized;
