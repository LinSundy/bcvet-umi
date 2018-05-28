/**
 * 数据字典类型列表
 * Created by penghuicong on 2017/12/13.
 */
import React, { PureComponent } from 'react';
import { Icon, Modal, Card } from 'antd';
import styles from './DictTypeList.less';

const { confirm } = Modal;

export default class DictTypeList extends PureComponent {
  state = {
    typeId: 0,
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      typeId: nextProps.typeId,
    });
  }

  // 获取dictList
  getDictList = (typeId) => {
    this.props.getList(typeId);
  };

  deleteDictType = (id) => {
    const { onDelete } = this.props;
    confirm({
      title: '确定要删除吗？',
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
    const { dictTypeList, onAdd, onEdit } = this.props;
    const { typeId } = this.state;
    return (
      <Card bordered={false}>
        <ul className={styles.dictTree}>
          <li className={!typeId ? styles.on : ''}>
            <p>
              <span className={styles.dictItem} onClick={this.getDictList.bind(this, undefined)}>
                <span className={styles.name}>
                  全部字典类型
                </span>
              </span>
              <span className={styles.btns}>
                <Icon type="plus" className={styles.plr5} onClick={onAdd} />
              </span>
            </p>
          </li>
          {
            dictTypeList && dictTypeList.length > 0 && dictTypeList.map((item, index) => {
              return (
                <li key={index} className={item.id === typeId ? styles.on : ''}>
                  <p>
                    <span
                      className={styles.dictItem}
                      onClick={this.getDictList.bind(this, item.id)}
                    >
                      <span className={styles.line} />
                      <span className={styles.name}>
                        {item.name}
                      </span>
                    </span>
                    <span className={styles.btns}>
                      <Icon type="edit" title="编辑" className={styles.plr5} onClick={onEdit.bind(this, item.id)} />
                      <Icon
                        type="delete"
                        title="删除"
                        className={styles.plr5}
                        onClick={this.deleteDictType.bind(this, item.id)}
                      />
                    </span>
                  </p>
                </li>
              );
            })
          }
        </ul>
      </Card>
    );
  }
}
