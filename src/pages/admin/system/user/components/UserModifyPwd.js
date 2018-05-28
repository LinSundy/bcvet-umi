/**
 * 修改密码弹出框
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Icon } from 'antd';
import SHA256 from 'crypto-js/sha256';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
export default class UserModifyPwd extends PureComponent {
  static defaultProps = {
    visible: false,
    confirmLoading: false,
    onOk: () => {
    },
    onCancel: () => {
    },
  };
  static contextTypes = {
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = { passwordDirty: false };

  checkConfirm(rule, value, callback) {
    if (value && this.state.passwordDirty) {
      this.props.form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({ passwordDirty: this.state.passwordDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    if (value && value !== this.props.form.getFieldValue('newPassword')) {
      callback('两个新密码输入不一致');
    } else {
      callback();
    }
  }

  handleOnOk = () => {
    const { onOk } = this.props;
    const { validateFields } = this.props.form;
    validateFields((errors, value) => {
      if (errors) {
        return;
      }
      const values = value;
      values.oldPassword = SHA256(values.oldPassword).toString();
      values.newPassword = SHA256(values.newPassword).toString();
      values.confirm = '';

      onOk(values);
    });
  };

  render() {
    const { visible, onCancel, confirmLoading } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        title={(<div><Icon type="edit" /> 修改密码</div>)}
        visible={visible}
        maskClosable
        onOk={this.handleOnOk}
        okText="确认修改"
        cancelText="放弃修改"
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="旧密码：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码',
                },
              ],
            })(<Input placeholder="请输入旧密码" type="password" />)}
          </FormItem>
          <FormItem label="新密码：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码',
                }, {
                  validator: ::this.checkConfirm,
                },
              ],
            })(<Input placeholder="请输入新密码" type="password" onBlur={::this.handlePasswordBlur} />)}
          </FormItem>
          <FormItem label="新密码确认：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码确认',
                }, {
                  validator: ::this.checkPassword,
                },
              ],
            })(<Input placeholder="请输入新密码确认" type="password" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
