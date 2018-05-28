/**
 * Created By chelin on .
 */
import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import styles from 'assets/less/home/content4.less';

export default class About extends React.Component {
  static defaultProps = {
    className: 'about'
  };
	render() {
    const props = { ...this.props };
		return (
      <OverPack
        {...props}
      >
        <QueueAnim
          type={['bottom', 'top']} delay={300}
          key="caseWrapper"
          interval={300}
          className={styles.aboutWrapper}
        >
          {[
            <p key="title" className="contentTitle">
              关于
              <span className="en">about</span>
            </p>,
            <div key="about">
              <QueueAnim
                className={styles.aboutBox}
                type={['right', 'left']} delay={500}
                interval={200}
              >
                {[
                  !props.isMode && <div key="border" className={styles.border} />,
                  !props.isMode && <div key="cover" className={styles.aboutCover} />,
                  <QueueAnim
                    type={['bottom', 'top']}
                    delay={300}
                    key="fonts"
                    interval={300}
                  >
                    {[
                      <p key="title" className={styles.content4Title}>北京百年视野教育科技有限公司</p>,
                      <p key="desc" className={styles.content4Desc}>北京百年视野教育科技有限公司，成立于2015年4月，注册资金300万元，
                        总部位于北京市海淀区增光路55号紫玉楼，研发中心位于山东济南高新
                        区舜泰广场1号楼。十年树木、百年树人——自成立伊始，公司即致力于
                        教育行业相关软件开发和远程教育培训服务工作，并取得了一定的成绩，
                        得到了广大用户的认可。软件开发方面：结合教育部文件精神和专家指
                        导意见，公司自主研发了远程教育培训平台、师范类院校继续教育网络
                        教育平台、教育行业区域资源共建共享平台等多项产品，均已投入使用，
                        产生了良好的市场效益和社会效益。</p>,
                    ]}
                  </QueueAnim>
                ]}
              </QueueAnim>
            </div>
          ]}
        </QueueAnim>
      </OverPack>
		);
	}
}
