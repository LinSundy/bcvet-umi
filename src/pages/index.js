import React from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';

export default connect()(() => {
  return <Redirect to="/web/" />;
});
