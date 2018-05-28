/**
 * Created by penghuicong on 2017/11/29.
 */
import React, { PureComponent } from 'react';
import { Table, Button, Modal, Divider } from 'antd';
import Cons from 'common/constant';
import styles from 'assets/less/admin.less';
import { getDictLabel } from 'components/Common/BnDict';

const { confirm } = Modal;

export default class MenuList extends PureComponent {
  handleDelete = (id) => {
    const { onDelete } = this.props;

    confirm({
      title: '确定删除该菜单？',
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
    const { list, loading, onAdd, onEdit, onAddSubMenu } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '权限编码',
      dataIndex: 'authCode',
      key: 'authCode',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: val => <span>{getDictLabel(Cons.DICT_CONSTANT.MENU_TYPE, `${val}`)}</span>,
      width: '100px',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: '200px',
      render: (text, record) => (
        <div>
          <a onClick={onEdit.bind(this, record.id)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this, record.id)}>删除</a>
          <Divider type="vertical" />
          <a onClick={onAddSubMenu.bind(this, record.id)}>添加子菜单</a>
        </div>
      ),
    },
    ];
    return (
      <div>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={onAdd}>
            新增
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: 940 }}
          rowKey={data => data.id}
          pagination={false}
        />
      </div>
    );
  }
}
