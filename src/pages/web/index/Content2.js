/**
 * Created By chelin on .
 */
import React from 'react';
import Swiper from 'react-id-swiper';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import 'assets/less/swiper.less';
import styles from 'assets/less/home/content2.less';

export default class Case extends React.Component {
  static defaultProps = {
    className: 'case'
  };

  constructor (props) {
    super(props);
    this.swiper = null;
  }

  // stop = () => {
  //   this.swiper.autoplay.stop();
  // };
  //
  // play = () => {
  //   this.swiper.autoplay.start();
  // };

  render() {
    const props = { ...this.props };
    const params = {
      grabCursor: true,
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      breakpoints: {
        991: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        765: {
          slidesPerView: 1,
          spaceBetween: 30
        },
      },
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      pagination: {
        el: '.swiper-pagination',
      }
    };
    return (
      <OverPack
        {...props}
      >
        <QueueAnim
          type={['bottom', 'top']} delay={300}
          key="caseWrapper"
          interval={300}
          className={styles.caseWrapper}
        >
          {[
            <p key="title" className="contentTitle">
              案例
              <span className="en">case</span>
            </p>,
            <div key="caseBox">
              <Swiper {...params} ref={node => {if(node) this.swiper = node.swiper}}>
                <div className={styles.caseBox} onMouseEnter={this.stop} onMouseLeave={this.play}>
                  <p className={styles.title}>茶文化</p>
                  <p className={styles.desc}>
                    喝茶，喝的是一种心境，感觉身心被
                    净化，滤去浮躁，沉淀下的是深思。茶是
                    一种情调，一种欲语还休的沉默；一种
                    欲笑还颦的忧伤。无茶的日子，
                    真的觉得平淡、索然无味。
                  </p>
                  <img className={styles.cover} src={require('assets/temp/1.png')} alt=""/>
                </div>
                <div className={styles.caseBox} onMouseEnter={this.stop} onMouseLeave={this.play}>
                  <p className={styles.title}>新疆和田师专实训平台</p>
                  <p className={styles.desc}>
                    新疆和田师专实训平台为自治区直属
                    师范专科院校，平台提供资源中心、课程中
                    心、问答、观摩公开课、实训室预约功能，
                    为了更好地支持师范生一体化培养，
                    切实提高师范生专业技能。
                  </p>
                  <img className={styles.cover} src={require('assets/temp/2.png')} alt=""/>
                </div>
                <div className={styles.caseBox} onMouseEnter={this.stop} onMouseLeave={this.play}>
                  <p className={styles.title}>合益木业</p>
                  <p className={styles.desc}>
                    临邑和益木业有限公司位于Ziqiu工业区，
                    边乔镇，平邑县，临邑市，是一家专业生产
                    和经营高档木制品的生产。本厂成立于2009
                    是AE实业有限公司的分支机构，公司的
                    生产能力48000-50000cbm一年。
                  </p>
                  <img className={styles.cover} src={require('assets/temp/3.png')} alt=""/>
                </div>
                <div className={styles.caseBox} onMouseEnter={this.stop} onMouseLeave={this.play}>
                  <p className={styles.title}>茶文化</p>
                  <p className={styles.desc}></p>
                  <img className={styles.cover} src={require('assets/temp/1.png')} alt=""/>
                </div>
                <div className={styles.caseBox} onMouseEnter={this.stop} onMouseLeave={this.play}>
                  <p className={styles.title}>茶文化</p>
                  <p className={styles.desc}></p>
                  <img className={styles.cover} src={require('assets/temp/2.png')} alt=""/>
                </div>
              </Swiper>
            </div>
          ]}
        </QueueAnim>
      </OverPack>
    );
  }
}
