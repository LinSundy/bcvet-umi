/**
 * 字典类型 添加 编辑 弹出框
 * Created by penghuicong on 2017/12/13.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Icon } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@Form.create()
export default class DictTypeForm extends PureComponent {
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
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onCancel: PropTypes.func,
    curItem: PropTypes.object,
  };

  submit = () => {
    const { onAdd, onEdit, type, curItem } = this.props;
    this.props.form.validateFields((err, value) => {
      if (err) {
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
    const { type, onCancel, visible, confirmLoading, curItem } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        title={type === 'add' ? <div><Icon type="plus" />新建字典类型</div> : <div><Icon type="edit" />编辑字典类型</div>}
        onOk={this.submit}
        onCancel={onCancel}
        okText='保存'
        cancelText='取消'
        visible={visible}
        confirmLoading={confirmLoading}
        maskClosable={false}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="字典类型名称：" {...formItemLayout} hasFeedback>
            {
              getFieldDecorator('name', {
                initialValue: curItem.name,
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入字典类型名称' },
                ],
              })(
                <Input placeholder="请输入字典类型名称" />
              )
            }
          </FormItem>
          <FormItem label="字典类型编码" {...formItemLayout} hasFeedback>
            {
              getFieldDecorator('type', {
                initialValue: curItem.type,
                rules: [
                  { required: true, message: '请输入字典类型编码' },
                ],
              })(
                <Input placeholder="请输入字典类型编码" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
