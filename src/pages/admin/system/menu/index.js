/**
 * Created by penghuicong on 2017/11/29.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import MenuList from './components/MenuList';
import MenuForm from './components/MenuForm';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import styles from 'assets/less/admin.less';

@connect(state => ({
  menu: state.menu,
  modal: state.modal,
}))

export default class MenuRoute extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'menu/fetch',
    });
  }

  // 显示新增菜单弹窗
  showAddModal = () => {
    this.props.dispatch({
      type: 'menu/showAddModal',
      payload: {
        type: 'add',
      },
    });
  };

  // 表单区新增确定提交
  addMenu = (data) => {
    this.props.dispatch({
      type: 'menu/add',
      payload: data,
    });
  };

  // 表单区隐藏
  handleCancle = () => {
    this.props.dispatch({
      type: 'modal/hideModal',
    });
  };

  // 显示编辑弹窗
  showEditModal = (id) => {
    this.props.dispatch({
      type: 'menu/showEditModal',
      payload: {
        type: 'edit',
        id,
      },
    });
  };

  // 编辑菜单提交
  editMenu = (data) => {
    this.props.dispatch({
      type: 'menu/edit',
      payload: data,
    });
  };

  // 删除菜单
  deleteMenu = (id) => {
    this.props.dispatch({
      type: 'menu/del',
      payload: id,
    });
  };

  // 添加子菜单
  addSubMenu = (id) => {
    this.props.dispatch({
      type: 'menu/showAddModal',
      payload: {
        type: 'sub',
        id,
      },
    });
  };

  render() {
    const { menu: { list, loading, parentList } } = this.props;
    const { modal: { visible, type, curItem, confirmLoading } } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <MenuList
              loading={loading}
              list={list}
              onAdd={this.showAddModal}
              onEdit={this.showEditModal}
              onDelete={this.deleteMenu}
              onAddSubMenu={this.addSubMenu}
            />
            <MenuForm
              type={type}
              onAdd={this.addMenu}
              onEdit={this.editMenu}
              visible={visible}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancle}
              parentList={parentList}
              curItem={curItem}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
