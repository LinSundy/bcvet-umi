/**
 * Created by chelin on 2017/12/4.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Button } from 'antd';
import styles from 'assets/less/admin.less';

const FormItem = Form.Item;
@Form.create()
export default class RoleSearch extends PureComponent {
  static contextTypes = {
    onReset: PropTypes.func,
    onSearch: PropTypes.func,
    onModalShow: PropTypes.func,
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
      onSearch && onSearch(fieldsValue);
    });
  };

  render() {
    const { values } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.tableListForm}>
        <Form>
          <Row gutter={48}>
            <Col span={8}>
              <FormItem label="角色名称">
                {
                  getFieldDecorator('roleName', {
                    initialValue: values.roleName || '',
                  })(
                    <Input placeholder="请输入角色名称" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="角色编码">
                {
                  getFieldDecorator('roleCode', {
                    initialValue: values.roleCode || '',
                  })(
                    <Input placeholder="请输入角色编码" />
                  )
                }
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
