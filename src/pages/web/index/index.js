import React from 'react';
import ReactDOM from 'react-dom';
import { enquireScreen } from 'enquire-js';
import ScrollAnim from 'rc-scroll-anim';
import Point from './Point';
import Content0 from './Content0';
import Content2 from './Content2';
import Content4 from './Content4';
import Content6 from './Content6';
import 'assets/less/home/antMotion_style.less';

const scrollScreen = ScrollAnim.scrollScreen;

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      show: !window.location.port,
    };
  }

  componentDidMount() {
    // 实现整屏滚动
    const docHeight = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    console.log(docHeight, scrollScreen);
    scrollScreen.init({docHeight: 704});
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
    if (window.location.port) {
      // 样式 build 时间在 200-300ms 之间;
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 500);
    }
  }

  render() {
    const children = [
      <Content0 id="content_0_0" key="content_0_0" isMode={this.state.isMobile} />,
      <Content2 id="content_2_0" key="content_2_0" isMode={this.state.isMobile} />,
      <Content4 id="content_4_0" key="content_4_0" isMode={this.state.isMobile} />,
      <Content6 id="content_6_0" key="content_6_0" isMode={this.state.isMobile} />,
      <Point key="list" ref="list" data={['content_0_0', 'content_2_0', 'content_4_0', 'content_6_0']} />,
    ];
    return (
      <div className="templates-wrapper">
        {this.state.show && children}
      </div>
    );
  }
}
