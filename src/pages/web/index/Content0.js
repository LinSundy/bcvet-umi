import React, { PropTypes } from 'react';
import { Button, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne, { TweenOneGroup } from 'rc-tween-one';
import BannerAnim, { Element } from 'rc-banner-anim';
import 'rc-banner-anim/assets/index.css';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import styles from 'assets/less/home/content0.less';

const BgElement = Element.BgElement;
class Banner extends React.Component {
  render() {
    const props = { ...this.props };
    delete props.ismode;
    // const childrenData = [
    //   {
    //     title: '<img width="100%" src="https://zos.alipayobjects.com/rmsportal/HqnZZjBjWRbjyMr.png" />',
    //     content: '用设计跟技术创造精彩',
    //     button: '查看更多',
    //   },
    //   {
    //     title: '<img width="100%" src="https://zos.alipayobjects.com/rmsportal/HqnZZjBjWRbjyMr.png" />',
    //     content: '一个高效的页面动画解决方案',
    //     button: 'Learn More',
    //   }
    // ];
    // const childrenToRender = childrenData.map((item, i) => {
    //   const title = item.title;
    //   const content = item.content;
    //   const button = item.button;
    //   return (<Element
    //     key={i}
    //     prefixCls="banner-user-elem"
    //   >
    //     <BgElement
    //       className={`bg bg${i}`}
    //       key="bg"
    //     />
    //     <QueueAnim
    //       type={['bottom', 'top']} delay={200}
    //       className={`${props.className}-title`}
    //       key="text"
    //       id={`${props.id}-wrapperBlock${i}`}
    //     >
    //       <span
    //         className="logo"
    //         key="logo"
    //         id={`${props.id}-titleBlock${i}`}
    //         dangerouslySetInnerHTML={{
    //           __html: title,
    //         }}
    //       />
    //       <p
    //         key="content"
    //         id={`${props.id}-contentBlock${i}`}
    //       >
    //         {content}
    //       </p>
    //       <Button
    //         type="ghost"
    //         key="button"
    //         id={`${props.id}-buttonBlock${i}`}
    //       >
    //         {button}
    //       </Button>
    //     </QueueAnim>
    //   </Element>);
    // });
    return (
      <OverPack
        {...props}
      >
        <TweenOneGroup
          key="banner"
          enter={{ opacity: 0, type: 'from' }}
          leave={{ opacity: 0 }}
          component=""
        >
          <div className={`${props.className}-wrapper`}>
            <BannerAnim
              key="banner"
            >
              <Element key='1' prefixCls="banner-user-elem"
              >
                <BgElement
                  className={`bg bg0`}
                  key="bg"
                />
                <QueueAnim
                  type={['bottom', 'top']} delay={300}
                  key="contentContainer"
                  interval={300}
                  className={styles.content0Container}
                >
                  {[
                    <p key="title" className={styles.content0Title}>互联网+教育解决方案</p>,
                    <p key="desc" className={styles.content0Desc}>用设计和技术创造精彩 专注于互联网应用产品解决方案</p>,
                    <a key="more" className={styles.content0More}>查看更多</a>,
                  ]}
                </QueueAnim>
              </Element>
              {/*{childrenToRender}*/}
            </BannerAnim>
          </div>
        </TweenOneGroup>
        <TweenOne
          animation={{ y: '-=20', yoyo: true, repeat: -1, duration: 1000 }}
          className={`${props.className}-icon`}
          style={{ bottom: 40 }}
          key="icon"
        >
          <Icon type="down" />
        </TweenOne>
      </OverPack>
    );
  }
}

Banner.defaultProps = {
  className: 'banner1',
};

export default Banner;

