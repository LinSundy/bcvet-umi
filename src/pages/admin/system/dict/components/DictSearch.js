/**
 * Created by penghuicong on 2017/12/18.
 */
import React, { Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import styles from 'assets/less/admin.less';

const FormItem = Form.Item;

@Form.create()
export default class DictSearch extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.typeId !== this.props.typeId) {
      this.props.form.resetFields();
    }
  }

  // 重置
  handleFormReset = () => {
    const { form, onRest } = this.props;
    form.resetFields();
    onRest && onRest({});
  };

  // 搜索
  handleFormSearch = (e) => {
    const { form, onSearch } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      onSearch && onSearch(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { values } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Form>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="字典名称：">
                {getFieldDecorator('label', {
                  initialValue: values.label || '',
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="字典数据值：">
                {getFieldDecorator('value', {
                  initialValue: values.value || '',
                })(
                  <Input type="text" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <span style={{ float: 'right' }}>
                <Button type="primary" onClick={this.handleFormSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
