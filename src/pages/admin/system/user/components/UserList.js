/**
 * 系统管理-用户管理-列表区
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Popconfirm, Dropdown, Menu, Icon, Modal, Divider } from 'antd';
import Cons from 'common/constant';
import Authorized from 'components/Authorized/Authorized';
import { getDictLabel } from 'components/Common/BnDict';

const { confirm } = Modal;

export default class UserList extends PureComponent {
  handleResetPwd = (id) => {
    const { onResetPwd } = this.props;

    confirm({
      title: '是否确定初始化密码?',
      content: '密码将被初始化为123456',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        onResetPwd(id);
      },
      onCancel() {
      },
    });
  };

  handleDelete = (id) => {
    const { onDelete } = this.props;

    confirm({
      title: '是否确定删除用户?',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        onDelete(id);
      },
      onCancel() {
      },
    });
  };

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

  render() {
    const {
      list, pageNum, pageSize, total, loading,
      onEdit, onStatus, onAuth, rowSelection,
    } = this.props;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'realname',
        key: 'realname',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        sorter: true,
        key: 'mobile',
        width: '130px',
      },
      {
        title: '状态',
        dataIndex: 'status',
        sorter: true,
        key: 'status',
        render: val => <span>{getDictLabel(Cons.DICT_CONSTANT.USER_STATUS, `${val}`)}</span>,
        width: '100px',
      },
      {
        title: '注册时间',
        dataIndex: 'gmtCreate',
        sorter: true,
        render: val => <span>{val && moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: '220px',
        render: (text, record) => (
          <div>
            <Authorized auth="user:edit">
              <a onClick={onEdit.bind(this, record.id)}>编辑</a>
            </Authorized>
            <Authorized auth="user:edit">
              <Divider type="vertical" />
              {record.status === Cons.USER_STATUS.ABLE ? (
                <Popconfirm
                  okText='确认'
                  cancelText='取消'
                  title="禁用后该用户将无法登陆，确定要禁用吗?"
                  onConfirm={onStatus.bind(this, record.id, Cons.USER_STATUS.DISABLE)}
                >
                  <a>禁用</a>
                </Popconfirm>
              ) : (
                <a onClick={onStatus.bind(this, record.id, Cons.USER_STATUS.ABLE)}>启用</a>
              )
              }
            </Authorized>
            <Authorized auth="user:authorize">
              <Divider type="vertical" />
              <a onClick={onAuth.bind(this, record.id)}>授权</a>
            </Authorized>
            <Authorized auth={['user:resetPwd', 'user:delete']}>
              <Divider type="vertical" />
              <Dropdown overlay={(
                <Menu>
                  <Menu.Item>
                    <Authorized auth="user:resetPwd">
                      <a onClick={this.handleResetPwd.bind(this, record.id)}>初始化密码</a>
                    </Authorized>
                  </Menu.Item>
                  <Menu.Item>
                    <Authorized auth="user:delete">
                      <a onClick={this.handleDelete.bind(this, record.id)}>删除</a>
                    </Authorized>
                  </Menu.Item>
                </Menu>
              )}
              >
                <a>
                  更多 <Icon type="down" />
                </a>
              </Dropdown>
            </Authorized>
          </div>
        ),
      },
    ];

    return (
      <div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          rowKey={record => record.id}
          onChange={this.handleTableChange}
          scroll={{ x: 945 }}
          pagination={{
            className: 'ant-table-pagination',
            showSizeChanger: true,
            showQuickJumper: true,
            total,
            current: pageNum,
            pageSize,
          }}
        />
      </div>
    );
  }
}
