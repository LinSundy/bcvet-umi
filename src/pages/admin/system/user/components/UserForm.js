/**
 * 系统管理-用户管理-新增/编辑-弹出用户表单
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Radio, Icon } from 'antd';
import { GET } from 'utils/request';

const validPhone = (rule, value, callback) => {
  if (!!value && !(/^1\d{10}$/.test(value))) {
    callback('手机号码格式不正确');
  } else {
    callback();
  }
};

const validUserForm = (type, userId, rule, value, callback) => {
  if (!value) {
    callback();
    return;
  }
  GET('/user/input/valid', { type, param: value, userId }).then((data) => {
    if (data.success) {
      callback();
    } else {
      callback(data.msg);
    }
  });
};


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
export default class UserForm extends PureComponent {
  static defaultProps = {
    visible: false,
    confirmLoading: false,
    onAdd: () => {
    },
    onEdit: () => {
    },
    onCancel: () => {
    },
    curItem: {},
  };
  static contextTypes = {
    curItem: PropTypes.object,
    visible: PropTypes.bool,
    type: PropTypes.string,
    confirmLoading: PropTypes.bool,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  handleOnOk = () => {
    const { type, onAdd, onEdit, curItem } = this.props;
    const { validateFields } = this.props.form;
    validateFields((errors, value) => {
      if (errors) {
        return;
      }

      const values = value;
      if (type === 'add') {
        onAdd(values);
      } else if (type === 'edit') {
        values.id = curItem.id;
        onEdit(values);
      }
    });
  };

  render() {
    const { type, visible, onCancel, curItem, confirmLoading } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        title={type === 'add' ? <div><Icon type="plus-circle-o" /> 新增用户</div> : <div><Icon type="edit" /> 编辑用户</div>}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOnOk}
        onCancel={onCancel}
        okText='保存'
        cancelText='取消'
        confirmLoading={confirmLoading}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="用户名：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: curItem.username,
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
                {
                  pattern: /^[A-Za-z0-9]{5,20}$/,
                  message: '用户名须由5-20个字符组成',
                },
                {
                  validator: validUserForm.bind(this, 'u', curItem.id),
                },
              ],
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem label="姓名：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('realname', {
              initialValue: curItem.realname,
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
                {
                  max: 20,
                  message: '姓名不能超过20字',
                },
              ],
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem label="性别：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: curItem.userDetail && curItem.userDetail.sex,
            })(
              <Radio.Group>
                <Radio value="">保密</Radio>
                <Radio value="m">男</Radio>
                <Radio value="f">女</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="手机号：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: curItem.mobile,
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  validator: validPhone,
                },
                {
                  validator: validUserForm.bind(this, 'm', curItem.id),
                },
              ],
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          <FormItem label="邮箱：" hasFeedback {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: curItem.email,
              rules: [
                {
                  type: 'email',
                  message: '邮箱格式不正确',
                },
                {
                  validator: validUserForm.bind(this, 'e', curItem.id),
                },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
