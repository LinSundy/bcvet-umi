/**
 * 字典数据新增编辑
 * Created by penghuicong on 2017/12/18.
 */
import React, { PureComponent } from 'react';
import { Form, Modal, Input, Select, InputNumber } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
export default class DictForm extends PureComponent {
  static defaultProps = {
    addVisible: false,
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
    addVisible: PropTypes.bool,
    modalType: PropTypes.string,
    confirmLoading: PropTypes.bool,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  // 提交
  handleSubmit = () => {
    const { modalType, onAdd, onEdit, curItem } = this.props;
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (err) {
        return;
      }

      const fieldsValue = value;
      if (modalType === 'add') {
        onAdd(fieldsValue);
      } else if (modalType === 'edit') {
        fieldsValue.id = curItem.id;
        onEdit(fieldsValue);
      }
    });
  };

  render() {
    const { modalType, addVisible, confirmLoading, curItem, dictTypeList, onCancel } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        title={modalType === 'add' ? <div>新增字典数据</div> : <div>编辑字典数据</div>}
        visible={addVisible}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        okText='保存'
        cancelText='取消'
        onOk={this.handleSubmit}
        maskClosable={false}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="字典名称" {...formItemLayout} hasFeedback>
            {
              getFieldDecorator('label', {
                initialValue: curItem.label,
                rules: [{ required: true, message: '请输入字典名称' }],
              })(
                <Input placeholder="请输入字典名称" />
              )
            }
          </FormItem>
          <FormItem label="字典数据值" {...formItemLayout} hasFeedback>
            {
              getFieldDecorator('value', {
                initialValue: curItem.value,
                rules: [{ required: true, message: '请输入字典数据值' }],
              })(
                <Input placeholder="请输入字典数据值" />
              )
            }
          </FormItem>
          <FormItem label="字典类型" {...formItemLayout} hasFeedback>
            {
              getFieldDecorator('typeId', {
                initialValue: curItem.typeId,
                rules: [{ required: true, message: '请选择字典类型' }],
              })(
                <Select>
                  {
                    dictTypeList && dictTypeList.length > 0 && dictTypeList.map((item, index) => {
                      return (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      );
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label="排序" {...formItemLayout}>
            {
              getFieldDecorator('sort', {
                initialValue: curItem.sort,
                rules: [{ required: true, message: '请填写排序' }],
              })(
                <InputNumber max={100} min={0} placeholder="" />
              )
            }
          </FormItem>
          <FormItem label="备注" {...formItemLayout}>
            {
              getFieldDecorator('remarks', {
                initialValue: curItem.remarks || '',
              })(
                <Input placeholder="请填写备注" />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
