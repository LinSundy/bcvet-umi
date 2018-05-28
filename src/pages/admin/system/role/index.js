/**
 * Created by chelin on 2017/12/1.
 */
import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import RoleSearch from './components/RoleSearch';
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import RoleOperate from './components/RoleOperate';
import RoleRules from './components/RoleRules';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import styles from 'assets/less/admin.less';

@connect(state => ({
  role: state.role,
  modal: state.modal,
}))
export default class RoleRoute extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'role/fetch',
      payload: {},
    });
  }

  // 搜索区,查询
  handleSearch = (values) => {
    this.props.dispatch({
      type: 'role/fetch',
      payload: { values, pageNum: 1 },
    });
  };

  // 翻页
  handleTableChange = (param) => {
    this.props.dispatch({
      type: 'role/fetch',
      payload: param,
    });
  };

  // 删除一条数据
  handleRoleDelete = (id) => {
    this.props.dispatch({
      type: 'role/delete',
      payload: id,
    });
  };

  // 显示新增表单并至为create类型
  handleAddRole = () => {
    this.props.dispatch({
      type: 'modal/showModal',
      payload: {
        type: 'create',
      },
    });
  };

  // 隐藏新增弹出框
  handleAddModalHide = () => {
    this.props.dispatch({
      type: 'modal/hideModal',
    });
  };

  // 新增数据保存
  addRole = (values) => {
    this.props.dispatch({
      type: 'role/add',
      payload: values,
    });
  };

  // 编辑数据保存
  editRole = (values) => {
    this.props.dispatch({
      type: 'role/edit',
      payload: values,
    });
  };

  // 显示编辑弹出框并至为edit类型
  handleEditRole = (id) => {
    this.props.dispatch({
      type: 'role/showEditModal',
      payload: {
        id,
        type: 'edit',
      },
    });
  };

  // 批量删除-弹出删除确认框
  handleBatchDelete = (ids, callback) => {
    this.props.dispatch({
      type: 'role/batchDelete',
      payload: ids,
      callback,
    });
  };

  // 批量删除
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 批量删除之后将selectedRowKeys置为空
  clearSelectData = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  // 显示角色权限调整Modal
  handleShowRules = (id) => {
    this.props.dispatch({
      type: 'role/showRulesModal',
      payload: {
        id,
      },
    });
  };

  // 隐藏角色权限调整Modal
  handleHideRules = () => {
    this.props.dispatch({
      type: 'role/rulesModalVisible',
      payload: false,
    });
  };

  // 保存角色菜单权限
  saveRoleRules = (roleId, resources) => {
    this.props.dispatch({
      type: 'role/saveRoleRules',
      payload: {
        roleId,
        resources,
      },
    });
  };

  render() {
    const {
      role: {
        list, pageNum, loading, pageSize, total,
        rulesModalVisible, roleMenus, allMenus,
        roleId, tableLoading, values = {},
      },
    } = this.props;
    const { modal: { type, curItem, visible, confirmLoading } } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled, // Column configuration not to be checked
      }),
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <RoleForm
              onEdit={this.editRole}
              confirmLoading={confirmLoading}
              curItem={curItem}
              type={type}
              onAdd={this.addRole}
              onCancel={this.handleAddModalHide}
              visible={visible}
            />
            <RoleRules
              confirmLoading={confirmLoading}
              tableLoading={tableLoading}
              onOk={this.saveRoleRules}
              onCancel={this.handleHideRules}
              visible={rulesModalVisible}
              roleMenus={roleMenus}
              allMenus={allMenus}
              roleId={roleId}
            />
            <RoleSearch onReset={this.handleSearch} onSearch={this.handleSearch} values={values} />
            <RoleOperate
              onAdd={this.handleAddRole}
              clearSelectData={this.clearSelectData}
              selectedRows={selectedRows}
              selectedRowKeys={selectedRowKeys}
              onBatchDelete={this.handleBatchDelete}
            />
            <RoleList
              loading={loading}
              list={list}
              pageNum={pageNum}
              pageSize={pageSize}
              total={total}
              onTableChange={this.handleTableChange}
              onDelete={this.handleRoleDelete}
              onEdit={this.handleEditRole}
              rowSelection={rowSelection}
              onShowRules={this.handleShowRules}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
