/*
 * @Author: chelin
 * @Date: 2017-12-08 09:25:34
 */
import React, { PureComponent } from 'react';
import { Popconfirm, Button } from 'antd';
import _ from 'lodash';
import styles from 'assets/less/admin.less';

class RoleOperate extends PureComponent {
  handleBatchDelete = () => {
    const { clearSelectData, onBatchDelete, selectedRows } = this.props;
    if (!selectedRows) {
      return;
    }
    onBatchDelete && onBatchDelete(_.map(selectedRows, 'id'), clearSelectData());
  };

  render() {
    const { onAdd, selectedRowKeys } = this.props;
    return (
      <div className={styles.tableListOperator}>
        <Button icon="plus" type="primary" onClick={onAdd}>新增</Button>
        {
          selectedRowKeys.length > 0 &&
          (
            <Popconfirm
              okText='确认'
              cancelText='取消'
              title={`当前已选${selectedRowKeys.length}项，确定要删除吗？`} onConfirm={this.handleBatchDelete}>
              <Button icon="delete" type="danger">批量删除({selectedRowKeys.length})</Button>
            </Popconfirm>
          )
        }
      </div>
    );
  }
}

export default RoleOperate;
