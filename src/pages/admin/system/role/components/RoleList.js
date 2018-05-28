/**
 * Created by chelin on 2017/12/5.
 */
import React, { PureComponent } from 'react';
import { Table, Modal, Divider } from 'antd';

const { confirm } = Modal;

class RoleList extends PureComponent {
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { onTableChange } = this.props;

    let sidx;
    let sord;
    if (sorter.field) {
      sidx = sorter.field;
      sord = sorter.order;
    }

    onTableChange({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sidx,
      sord,
    });
  };

  // 删除单条数据
  handleDel = (id) => {
    const { onDelete } = this.props;
    confirm({
      title: '确定删除该条数据么？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        onDelete(id);
      },
    });
  };

  // 编辑单条数据
  handleEdit = (id) => {
    this.props.onEdit(id);
  };

  render() {
    const { list, loading, rowSelection, onShowRules, total, pageSize, pageNum } = this.props;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'rolename',
      },
      {
        title: '角色编码',
        dataIndex: 'roleCode',
        key: 'rolecode',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        fixed: 'right',
        width: '250px',
        render: (text, record) => (
          <span>
            <a onClick={onShowRules.bind(this, record.id)}>角色权限调整</a>
            <Divider type="vertical" />
            <a onClick={this.handleEdit.bind(this, record.id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handleDel.bind(this, record.id)}>删除</a>
          </span>
        ),
      },
    ];
    return (
      <Table
        loading={loading}
        columns={columns}
        onChange={this.handleTableChange}
        rowSelection={rowSelection}
        dataSource={list}
        scroll={{ x: 700 }}
        rowKey={record => record.id}
        pagination={{
          className: 'ant-table-pagination',
          showSizeChanger: true,
          showQuickJumper: true,
          total,
          current: pageNum,
          pageSize,
        }}
      />
    );
  }
}

export default RoleList;
