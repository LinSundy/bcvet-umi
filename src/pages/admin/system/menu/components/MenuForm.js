/**
 * 新增、编辑弹出框
 * Created by penghuicong on 2017/12/4.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Icon, Select, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
@Form.create()
export default class MenuForm extends PureComponent {
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
    parentList: [],
  };
  static contextTypes = {
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onCancel: PropTypes.func,
    type: PropTypes.string,
    curItem: PropTypes.object,
    parentList: PropTypes.array,
  };

  submit = () => {
    const { validateFields } = this.props.form;
    const { onAdd, onEdit, type, curItem } = this.props;
    validateFields((err, value) => {
      if (err) {
        return;
      }

      const values = value;
      if (type === 'add' || type === 'sub') {
        onAdd(values);
      } else if (type === 'edit') {
        values.id = curItem.id;
        onEdit(values);
      }
    });
  };

  renderTree = (data) => {
    return data.map((item) => {
      if (!item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={`${item.id}`} />
        );
      } else {
        return (
          <TreeNode title={item.name} key={item.id} value={`${item.id}`}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
    });
  };

  render() {
    const { confirmLoading, type, visible, onCancel, parentList, curItem } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        confirmLoading={confirmLoading}
        title={type === 'add' ? <div><Icon type="plus-circle-o" />新建菜单</div> : type === 'sub' ?
          <div><Icon type="plus-circle-o" />添加子菜单</div> : <div><Icon type="edit" />编辑菜单</div>}
        visible={visible}
        okText='保存'
        cancelText='取消'
        maskClosable={false}
        afterClose={() => resetFields()}
        onOk={this.submit}
        onCancel={onCancel}
      >
        <Form>
          <FormItem {...formItemLayout} hasFeedback label="菜单类型：">
            {
              getFieldDecorator('type', {
                initialValue: !curItem.type ? '0' : `${curItem.type}`,
                rules: [
                  { required: true, message: '请选择菜单类型' },
                ],
              })(
                <Select placeholder="请选择菜单类型">
                  <Option value="0">菜单</Option>
                  <Option value="1">按钮</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="父级菜单：">
            {
              getFieldDecorator('pid', {
                initialValue: !curItem.pid ? '0' : `${curItem.pid}`,
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: '请选择父级菜单',
                  },
                ],
              })(
                <TreeSelect placeholder="请选择父级菜单" allowClear>
                  {
                    this.renderTree(parentList)
                  }
                </TreeSelect>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="菜单名称：">
            {
              getFieldDecorator('name', {
                initialValue: curItem.name,
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: '请输入菜单名称',
                  },
                  {
                    max: 20,
                    message: '菜单名称不能超过20字',
                  },
                ],
              })(
                <Input placeholder="请输入菜单名称" />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="权限编码：">
            {
              getFieldDecorator('authCode', {
                initialValue: curItem.authCode,
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: '请输入权限编码',
                  },
                  {
                    max: 50,
                    message: '权限编码不能超过50字',
                  },
                ],
              })(
                <Input placeholder="请输入权限编码" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
