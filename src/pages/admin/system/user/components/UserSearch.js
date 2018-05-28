/**
 * 系统管理-用户管理-搜索区
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import { Form, Select, Input, Row, Col, Button, Icon, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import styles from 'assets/less/admin.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@Form.create()
export default class UserSearch extends PureComponent {
  static contextTypes = {
    values: PropTypes.object,
    onReset: PropTypes.func,
    onSearch: PropTypes.func,
  };

  state = {
    expandForm: false,
  };

  handleFormReset = () => {
    const { form, onReset } = this.props;
    form.resetFields();
    onReset && onReset({});
  };

  handleFormSearch = (e) => {
    e.preventDefault();

    const { form, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        createTime: fieldsValue.createTime && fieldsValue.createTime.valueOf(),
      };

      onSearch && onSearch(values);
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  render() {
    const { expandForm } = this.state;
    const { values } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.tableListForm}>
        {!expandForm ? (
          <Form>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: values.username || '',
                  })(
                    <Input placeholder="输入用户名/姓名模糊查询" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="用户状态">
                  {getFieldDecorator('status', {
                    initialValue: values.status || '',
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="0">正常</Option>
                      <Option value="1">禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <span style={{ float: 'right' }}>
                  <Button type="primary" onClick={this.handleFormSearch}>查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        ) : (
          <Form>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: values.username || '',
                  })(
                    <Input placeholder="输入用户名/姓名模糊查询" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="用户状态">
                  {getFieldDecorator('status', {
                    initialValue: values.status || '',
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="0">正常</Option>
                      <Option value="1">禁用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} />
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem label="手机号">
                  {getFieldDecorator('mobile', {
                    initialValue: values.mobile || '',
                  })(
                    <Input placeholder="输入手机号模糊查询" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="注册日期">
                  {getFieldDecorator('createTime', {
                    initialValue: values.createTime || '',
                  })(
                    <RangePicker format={dateFormat} style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col span={8} />
              <Col span={8}>
                <span style={{ float: 'right' }}>
                  <Button type="primary" onClick={this.handleFormSearch}>查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    收起 <Icon type="up" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    );
  }
}
