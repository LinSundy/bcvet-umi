/**
 * 字典数据列表
 * Created by penghuicong on 2017/12/13.
 */
import React, { PureComponent } from 'react';
import { Modal, Table, Divider } from 'antd';

const { confirm } = Modal;

export default class DictList extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    const { changePage } = this.props;
    let sidx;
    let sord;
    if (sorter.field) {
      sidx = sorter.field;
      sord = sorter.order;
    }
    changePage({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sidx,
      sord,
    });
  };

  handleDelete = (id) => {
    const { onDelete } = this.props;

    confirm({
      title: '确认删除吗？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        onDelete(id);
      },
      onCancel() {
      },
    });
  };

  render() {
    const { onEdit, dictList, rowSelection, loading, total, pageNum, pageSize } = this.props;
    const columns = [{
      title: '字典名称',
      dataIndex: 'label',
      key: 'label',
    }, {
      title: '字典数据值',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '字典类型编码',
      dataIndex: 'dictType.type',
      key: 'typeType',
    }, {
      title: '字典类型名称',
      dataIndex: 'dictType.name',
      key: 'typeName',
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '80px',
    }, {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: '150px',
      render: (text, record) => (
        <div>
          <a onClick={onEdit.bind(this, record.id)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this, record.id)}>删除</a>
        </div>
      ),
    }];
    return (
      <Table
        columns={columns}
        dataSource={dictList}
        rowSelection={rowSelection}
        loading={loading}
        onChange={this.handleTableChange}
        rowKey={record => record.id}
        scroll={{ x: 700 }}
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
