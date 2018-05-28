import React from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';

function IndexPage() {
  return <Redirect to="/web/index" />;
}

export default connect()(IndexPage);
