import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, notification } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import _ from 'lodash';
import { enquireScreen, unenquireScreen  } from 'enquire-js';
import GlobalHeader from 'components/GlobalHeader';
import GlobalFooter from 'components/GlobalFooter';
import SiderMenu from 'components/SiderMenu';
import Authorized from 'components/Authorized/Authorized';
import { getMenuData } from 'common/menu';

const { Content, Header, Footer } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

@connect(({ global }) => ({
  currentUser: global.currentUser,
  collapsed: global.collapsed,
}))
export default class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    const { location } = this.props;
    return {
      location,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch({
      type: 'global/fetchCurrent',
    });

    this.menuDatas = getMenuData();

    if (!this.menuDatas || _.isEmpty(this.menuDatas)) {
      notification.error({
        message: '无后台访问权限',
      });
      router.push('/admin/login');
    }
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'global/adminLogout',
      });
    }
  };

  render() {
    const {
      currentUser,
      collapsed,
      location,
      children,
    } = this.props;
    // const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        <SiderMenu
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={this.menuDatas}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              currentUser={currentUser}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            {children}
          </Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 百年视野教育科技有限公司
                </Fragment>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={window.site_title}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}
