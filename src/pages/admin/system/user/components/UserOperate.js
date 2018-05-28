/**
 * Created by penghuicong on 2017/12/6.
 */
import React, { PureComponent } from 'react';
import { Popconfirm, Button } from 'antd';
import _ from 'lodash';
import Authorized from 'components/Authorized/Authorized';
import styles from 'assets/less/admin.less';

export default class UserOperate extends PureComponent {
  // 批量删除
  handleBatchDelete = () => {
    const { onBatchDelete, selectedRows, clearSelectData } = this.props;
    if (!selectedRows) {
      return;
    }

    onBatchDelete && onBatchDelete(_.map(selectedRows, 'id'), clearSelectData());
  };

  render() {
    const { onAdd, onImport, selectedRowKeys } = this.props;
    return (
      <div className={styles.tableListOperator}>
        <Authorized auth="user:add">
          <Button icon="plus" type="primary" onClick={onAdd}>添加用户</Button>
        </Authorized>
        <Authorized auth="user:import">
          <Button icon="upload" onClick={onImport.bind(this, true)}>导入用户</Button>
        </Authorized>
        <Authorized auth="user:delete">
          {
            selectedRowKeys.length > 0 && (
              <Popconfirm
                okText='确认'
                cancelText='取消'
                title={`当前已选${selectedRowKeys.length}项，确定要删除吗?`} onConfirm={this.handleBatchDelete}>
                <Button icon="delete" type="danger">批量删除({selectedRowKeys.length})</Button>
              </Popconfirm>
            )
          }
        </Authorized>
      </div>
    );
  }
}
