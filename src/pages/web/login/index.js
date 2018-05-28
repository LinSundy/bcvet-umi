import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import GlobalFooter from 'components/GlobalFooter';
import SHA256 from 'crypto-js/sha256';
import styles from './login.less';

const copyright = <Fragment>Copyright <Icon type="copyright" /> 2018 百年视野教育科技有限公司</Fragment>;
const FormItem = Form.Item;

@connect(state => ({
  login: state.login,
}))
class LoginRoute extends Component {
  state = {
    count: 0,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, value) => {
        const values = value;
        values.password = SHA256(values.password).toString();
        if (!err) {
          this.props.dispatch({
            type: `login/submit`,
            payload: values,
          });
        }
      }
    );
  };

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { success, submitting, msg } = this.props.login;
    const { count } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.logo}>GLLINKING HR</span>
            </div>
            <div className={styles.desc}>在线招聘系统</div>
          </div>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              {
                !success &&
                submitting === false &&
                this.renderMessage(msg || '账户或密码错误')
              }
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: true, message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: true, message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon} />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>

              <FormItem className={styles.additional}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
                )}
                <a className={styles.forgot} href="">注册账户</a>
                <Button size="large" loading={submitting} className={styles.submit} type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}
export default Form.create()(LoginRoute);
