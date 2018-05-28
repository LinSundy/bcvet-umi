/*
 * @Author: chelin
 * @Date: 2017-12-12 16:36:19
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Icon, Checkbox } from 'antd';
import _ from 'lodash';

export default class RoleRules extends PureComponent {
  static defaultProps = {
    roleMenus: [],
    confirmLoading: true,
    tableLoading: true,
  };
  static contextTypes = {
    roleMenus: PropTypes.array,
    allMenus: PropTypes.array,
    onCancel: PropTypes.func,
    roleId: PropTypes.number,
    confirmLoading: PropTypes.bool,
    tableLoading: PropTypes.bool,
  };
  state = {
    selectedRowKeys: this.props.roleMenus || [],
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { roleMenus } = nextProps;
    this.setState({
      selectedRowKeys: roleMenus,
    });
  }

  // 获取当前选中,传入state
  onSelect = (record, selected) => {
    const roleMenusActive = _.clone(this.state.selectedRowKeys);
    if (selected) {
      roleMenusActive.push(record.id);
      this.pushAllIn(roleMenusActive, record.children);
      this.pushAllIn(roleMenusActive, record.rules);
    } else {
      _.pull(roleMenusActive, record.id);
      this.pullAllOut(roleMenusActive, record.children);
      this.pullAllOut(roleMenusActive, record.rules);
    }

    this.setState({
      selectedRowKeys: roleMenusActive,
    });
  };

  onSelectAll = (selected) => {
    const roleMenusActive = [];
    if (selected) {
      const { allMenus } = this.props;
      allMenus && allMenus.map((item) => {
        roleMenusActive.push(item.id);
        this.pushAllIn(roleMenusActive, item.children);
        this.pushAllIn(roleMenusActive, item.rules);
        return item;
      });
    }

    this.setState({
      selectedRowKeys: roleMenusActive,
    });
  };

  onChange = (e) => {
    const roleMenusActive = _.clone(this.state.selectedRowKeys);
    if (e.target.checked) {
      roleMenusActive.push(e.target.value);
    } else {
      _.pull(roleMenusActive, e.target.value);
    }
    this.setState({
      selectedRowKeys: roleMenusActive,
    });
  };

  onOk = () => {
    const { onOk, roleId } = this.props;
    onOk(roleId, this.state.selectedRowKeys);
  };

  pushAllIn = (array, list) => {
    if (!list || _.isEmpty(list)) {
      return;
    }
    list.map((item) => {
      array.push(item.id);
      this.pushAllIn(array, item.children);
      this.pushAllIn(array, item.rules);
      return item;
    });
  };

  pullAllOut = (array, list) => {
    if (!list || _.isEmpty(list)) {
      return;
    }
    list.map((item) => {
      _.pull(array, item.id);
      this.pullAllOut(array, item.children);
      this.pullAllOut(array, item.rules);
      return item;
    });
  };

  // 判断是否存在于state中
  isInArray = (ele, array) => {
    return array.indexOf(ele) !== -1;
  };

  resetFields = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  render() {
    const columns = [
      {
        title: '菜单',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render: (text, record) => {
          return (
            <span>
              <Icon style={{ marginRight: 5 }} type={record.iconUrl} />
              {record.name}
            </span>
          );
        },
      },
      {
        title: '操作权限',
        key: 'rules',
        render: (text, record) => {
          return (
            <span>
              {
                (record.rules && !_.isEmpty(record.rules)) && record.rules.map((item) => {
                  return (
                    <Checkbox
                      style={{ marginLeft: '8px' }}
                      checked={this.isInArray(item.id, this.state.selectedRowKeys)}
                      onChange={this.onChange}
                      key={item.id}
                      value={item.id}
                    >{item.name}
                    </Checkbox>
);
                })
              }
            </span>
          );
        },
      },
    ];

    // 当onChange时候改变单行数据
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onSelect: (record, selected) => {
        this.onSelect(record, selected);
      },
      onSelectAll: (selected) => {
        this.onSelectAll(selected);
      },
    };

    const titleIcon = (
      <span>
        <Icon type="edit" />
        <span style={{ marginLeft: 10 }}>角色权限调整</span>
      </span>
    );

    const { allMenus, onCancel, visible, confirmLoading, tableLoading } = this.props;

    return (
      <Modal
        onOk={this.onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        title={titleIcon}
        visible={visible}
        okText='保存'
        cancelText='取消'
        width={800}
        afterClose={this.resetFields}
      >
        <Table
          pagination={false}
          defaultExpandAllRows
          bordered
          indentSize={20}
          loading={tableLoading}
          dataSource={allMenus}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }
}
