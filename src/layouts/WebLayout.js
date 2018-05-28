import React from 'react';
import DocumentTitle from 'react-document-title';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <DocumentTitle title={window.site_title}>
    <div style={{ height: '100%' }} className={wrapperClassName}>
      {top}
      {children}
    </div>
  </DocumentTitle>
);
