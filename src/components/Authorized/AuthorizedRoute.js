import React from 'react';
import { Route } from 'dva/router';
import Exception from 'components/Exception';
import Link from 'umi/link';
import Authorized from './Authorized';

const Exception403 = <Route render={() => (
  <Exception
    type="403"
    style={{ minHeight: 500, height: '80%' }}
    linkElement={Link}
  />
)} />;

export default class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, auth, ...rest } = this.props;
    return (
      <Authorized auth={auth} noAuth={Exception403}>
        <Route
          {...rest}
          render={props => (Component ? <Component {...props} /> : render(props))}
        />
      </Authorized>
    );
  }
}
