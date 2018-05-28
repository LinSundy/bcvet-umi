/**
 * 系统管理-用户管理
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserRole from './components/UserRole';
import UserImport from './components/UserImport';
import UserSearch from './components/UserSearch';
import UserOperate from './components/UserOperate';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import styles from 'assets/less/admin.less';

@connect(state => ({
  user: state.user,
  modal: state.modal,
}))
export default class UserRoute extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetch',
      payload: {},
    });
  }

  // 搜索区，查询
  handleSearch = (values) => {
    this.props.dispatch({
      type: 'user/fetch',
      payload: { values, pageNum: 1 },
    });
  };

  // 列表区：删除
  handleUserDelete = (id) => {
    this.props.dispatch({
      type: 'user/delete',
      payload: id,
    });
  };

  // 列表区：批量删除
  handleBatchDelete = (ids, callback) => {
    this.props.dispatch({
      type: 'user/batchDelete',
      payload: ids,
      callback,
    });
  };

  // 列表区：启用禁用
  handleStatus = (id, status) => {
    this.props.dispatch({
      type: 'user/status',
      payload: {
        id,
        status,
      },
    });
  };

  // 列表区：初始化密码
  handlerResetPwd = (id) => {
    this.props.dispatch({
      type: 'user/resetPwd',
      payload: id,
    });
  };

  // 列表区：分页排序
  handleTableChange = (params) => {
    this.props.dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };

  // 表单区，显示新增表单
  handleAddUser = () => {
    this.props.dispatch({
      type: 'modal/showModal',
      payload: {
        type: 'add',
      },
    });
  };

  // 表单区，新增
  addUser = (data) => {
    this.props.dispatch({
      type: 'user/add',
      payload: data,
    });
  };

  // 表单区，显示编辑表单
  handleEdit = (id) => {
    this.props.dispatch({
      type: 'user/showEditModal',
      payload: {
        type: 'edit',
        id,
      },
    });
  };

  // 表单区，编辑
  editUser = (data) => {
    this.props.dispatch({
      type: 'user/edit',
      payload: data,
    });
  };

  // 表单区，隐藏表单
  hiddenModal = () => {
    this.props.dispatch({
      type: 'modal/hideModal',
    });
  };

  // 显示授权表单
  showRoleModal = (userId) => {
    this.props.dispatch({
      type: 'user/showRoleModal',
      payload: userId,
    });
  };

  // 隐藏授权表单
  hiddenRoleModal = () => {
    this.props.dispatch({
      type: 'user/hiddenRoleModal',
    });
  };

  // 保存用户授权
  saveUserRole = ({ roleIds, userId }) => {
    this.props.dispatch({
      type: 'user/saveUserRole',
      payload: {
        roleIds,
        userId,
      },
    });
  };

  // 显示用户导入表单
  showImportModal = () => {
    this.props.dispatch({
      type: 'user/showImportModal',
    });
  };

  // 隐藏用户导入表单
  hiddenImportModal = () => {
    this.props.dispatch({
      type: 'user/hiddenImportModal',
    });
  };

  // 用户导入保存
  importUser = (formData) => {
    this.props.dispatch({
      type: 'user/importUser',
      payload: formData,
    });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  // 批量删除之后将selectedRowKeys,selectedRows置为空
  clearSelectData = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  render() {
    const {
      user: {
        list, pageNum, pageSize, total, loading,
        roleModalVisible, roleModalData, importModalVisible,
        values,
      },
    } = this.props;
    const { modal: { visible, type, curItem, confirmLoading } } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <UserSearch onReset={this.handleSearch} onSearch={this.handleSearch} values={values} />

            <UserOperate
              onAdd={this.handleAddUser}
              onImport={this.showImportModal}
              selectedRowKeys={selectedRowKeys}
              selectedRows={selectedRows}
              onBatchDelete={this.handleBatchDelete}
              clearSelectData={this.clearSelectData}
            />

            <UserList
              ref="userList"
              loading={loading}
              list={list}
              pageNum={pageNum}
              pageSize={pageSize}
              total={total}
              onEdit={this.handleEdit}
              onStatus={this.handleStatus}
              onDelete={this.handleUserDelete}
              onResetPwd={this.handlerResetPwd}
              onTableChange={this.handleTableChange}
              onAuth={this.showRoleModal}
              rowSelection={rowSelection}
            />

            <UserForm
              type={type}
              confirmLoading={confirmLoading}
              curItem={curItem}
              visible={visible}
              onAdd={this.addUser}
              onEdit={this.editUser}
              onCancel={this.hiddenModal}
            />

            <UserRole
              data={roleModalData}
              visible={roleModalVisible}
              confirmLoading={confirmLoading}
              onOk={this.saveUserRole}
              onCancel={this.hiddenRoleModal}
            />

            <UserImport
              visible={importModalVisible}
              confirmLoading={confirmLoading}
              onOk={this.importUser}
              onCancel={this.hiddenImportModal}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
