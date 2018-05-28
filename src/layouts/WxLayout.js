import React from 'react';
import DocumentTitle from 'react-document-title';
import styles from './WebLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <DocumentTitle title={window.site_title}>
    <div className={wrapperClassName}>
      {top}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  </DocumentTitle>
);
