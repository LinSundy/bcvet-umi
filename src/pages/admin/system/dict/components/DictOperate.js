/**
 * 字典数据操作区 ，新增，批量删除
 * Created by penghuicong on 2017/12/18.
 */
import React, { PureComponent } from 'react';
import { Button, Popconfirm } from 'antd';
import _ from 'lodash';
import styles from 'assets/less/admin.less';

export default class DictOperate extends PureComponent {
  // 批量删除
  handleBatchDelete = () => {
    const { onBatchDelete, selectedRows, clearSelect } = this.props;
    if (!selectedRows) {
      return;
    }

    onBatchDelete && onBatchDelete(_.map(selectedRows, 'id'), clearSelect());
  };

  render() {
    const { selectedRowKeys, onAdd, onRefresh } = this.props;
    return (
      <div className={styles.tableListOperator}>
        <Button icon="plus" type="primary" onClick={onAdd}>新增</Button>
        <Popconfirm title="确定刷新缓存吗？" onConfirm={onRefresh}>
          <Button icon="reload">刷新缓存</Button>
        </Popconfirm>
        {
          selectedRowKeys.length > 0 && (
            <Popconfirm
              okText='确认'
              cancelText='取消'
              title={`当前已选${selectedRowKeys.length}项，确定要删除吗？`} onConfirm={this.handleBatchDelete}>
              <Button type="danger" icon="delete">批量删除({selectedRowKeys.length})</Button>
            </Popconfirm>
          )
        }
      </div>
    );
  }
}
