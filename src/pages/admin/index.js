import React from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';

function IndexPage({ loginFlag }) {
  if (!loginFlag) {
    return <Redirect to="/admin/login" />;
  }

  return <Redirect to="/admin/system/user" />;
}

IndexPage.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    loginFlag: state.global.loginFlag,
  };
};

export default connect(mapStateToProps)(IndexPage);
