/**
 * Created By chelin on .
 */
import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import styles from 'assets/less/home/content6.less';

export default class Contact extends React.Component {
  static defaultProps = {
    className: 'contact',
  };

  render() {
    const props = {...this.props};
    return (
      <OverPack
        {...props}
      >
        <QueueAnim
          animConfig={[
            {translateX: [0, -360]},
          ]}
          delay={300}
          key="contact"
        >
          {[
            <div key="contactWrapper" className={styles.contactWrapper}>
              <QueueAnim
                type={['left', 'right']} delay={300}
              >
                {[
                  <QueueAnim key="contactIcons" className={styles.contactIcons}/>,
                  <img key="qrCode" className={styles.qrCode} src={require('assets/img/qrCode.png')}/>,
                  <QueueAnim
                    type={['bottom', 'top']} delay={300}
                    key="locations"
                    interval={300}
                    className={styles.locations}
                  >
                    {[
                      <div key="bj">
                        <p className={styles.title}>
                          北京
                        </p>
                        <p className={styles.info}>
                          北京市海淀区增光路55号紫玉写字楼908室
                        </p>
                        <p className={styles.info}>联系方式：010-88516163</p>
                        <p className={styles.info}>邮箱：service@bcvet.cn</p>
                      </div>,
                      <div key="jn">
                        <p className={styles.title}>
                          北京
                        </p>
                        <p className={styles.info}>
                          济南市高新区舜华路街道舜泰广场1号楼
                        </p>
                        <p className={styles.info}>联系方式：0531－55513272</p>
                        <p className={styles.info}>邮箱：service@bcvet.cn</p>
                      </div>,
                    ]}
                  </QueueAnim>
                ]}
              </QueueAnim>
            </div>,
          ]}
        </QueueAnim>
      </OverPack>
    );
  }
}
