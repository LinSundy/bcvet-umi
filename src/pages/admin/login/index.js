import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import DocumentTitle from 'react-document-title';
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
    time: new Date().getTime(),
  };

  onSwitch = (loginType) => {
    this.props.dispatch({
      type: 'login/changeLoginType',
      payload: {
        loginType,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { loginType } = this.props.login;
    this.props.form.validateFields({ force: true },
      (err, value) => {
        const values = value;
        values.password = SHA256(values.password).toString();
        if (!err) {
          this.props.dispatch({
            type: `login/${loginType}Submit`,
            payload: values,
            callback: this.changeRandCode,
          });
        }
      }
    );
  };

  changeRandCode = () => {
    this.setState({
      time: new Date().getTime(),
    });
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
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { time } = this.state;
    return (
      <DocumentTitle title={`登录 - ${window.site_title}`}>
        <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.logo}>GLLINKING HR</span>
            </div>
            <div className={styles.desc}>后台管理系统</div>
          </div>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              {
                !login.success &&
                login.loginType === 'account' &&
                login.submitting === false &&
                this.renderMessage(login.msg || '账户或密码错误')
              }
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [ {
                    required: login.loginType === 'account', message: '请输入账户名！',
                  } ],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon}/>}
                    placeholder="请输入账户名"
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [ {
                    required: login.loginType === 'account', message: '请输入密码！',
                  } ],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon}/>}
                    type="password"
                    placeholder="请输入密码"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('randCode', {
                      rules: [ {
                        required: login.loginType === 'account',
                        message: '请输入验证码！',
                        len: 4,
                      } ],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon}/>}
                        placeholder="验证码"
                      />,
                    )}
                  </Col>
                  <Col span={8}>
                    <img
                      width="117"
                      height="40"
                      alt="验证码"
                      onClick={this.changeRandCode}
                      src={`${window.api_host}/login/code?_t=${time}`}
                    />
                  </Col>
                </Row>
              </FormItem>

              <FormItem className={styles.additional}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox className={styles.autoLogin}>自动登录</Checkbox>,
                )}
                {/* <a className={styles.forgot} href="">忘记密码</a> */}
                <Button size="large" loading={login.submitting} className={styles.submit} type="primary"
                        htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <GlobalFooter copyright={copyright}/>
      </div>
      </DocumentTitle>
    );
  }
}
export default Form.create()(LoginRoute);
