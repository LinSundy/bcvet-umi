import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon, Modal } from 'antd';

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
export default class RoleModal extends PureComponent {
  static defaultProps = {
    curItem: {},
  };
  static contentTypes = {
    visible: PropTypes.boolean,
    onModalHide: PropTypes.func,
    onOk: PropTypes.func,
  };

  handleOnOk = () => {
    const { type, onAdd, onEdit, curItem } = this.props;
    const { validateFields } = this.props.form;
    validateFields((errors, value) => {
      if (errors) {
        return;
      }

      const values = value;
      if (type === 'create') {
        onAdd(values);
      } else if (type === 'edit') {
        values.id = curItem.id;
        onEdit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { curItem, type, onCancel, visible, confirmLoading } = this.props;
    return (
      <Modal
        onOk={this.handleOnOk}
        onCancel={onCancel}
        title={type === 'edit' ? <span><Icon type="edit" /> 编辑</span> : <span><Icon type="plus-circle-o" /> 新增</span>}
        visible={visible}
        okText='保存'
        cancelText='取消'
        confirmLoading={confirmLoading}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="角色名称" hasFeedback {...formItemLayout}>
            {
              getFieldDecorator('roleName', {
                initialValue: curItem.roleName,
                rules: [
                  {
                    required: true,
                    message: '请输入角色名称',
                  },
                ],
              })(<Input />)
            }
          </FormItem>
          <FormItem label="角色编码" hasFeedback {...formItemLayout}>
            {
              getFieldDecorator('roleCode', {
                initialValue: curItem.roleCode,
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: '请输入角色编码',
                  },
                  {
                    max: 10,
                    message: '请输入1-10位任意字符',
                  },
                ],
              })(<Input />)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

