import React from 'react';
import pathToRegexp from 'path-to-regexp';
import withRouter from 'umi/withRouter';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import BasicLayout from './BasicLayout';
import WxLayout from './WxLayout';
import WebLayout from './WebLayout';

class Layout extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { location, children } = this.props;
    const { pathname } = location;
    let LayoutComponent = WebLayout;
    if (pathToRegexp('/admin/login').test(pathname)) {
      return (
        <div>
          {children}
        </div>
      );
    } else if (pathToRegexp('/admin(.*)').test(pathname)) {
      LayoutComponent = BasicLayout;
    } else if (pathToRegexp('/wx(.*)').test(pathname)) {
      LayoutComponent = WxLayout;
    } else if (pathToRegexp('/web(.*)').test(pathname)) {
      LayoutComponent = WebLayout;
    }
    return (
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <LayoutComponent location={location}>{children}</LayoutComponent>
        </CSSTransition>
      </TransitionGroup>

    );
  }
}

export default withRouter(Layout);
