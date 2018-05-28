/**
 * 系统管理-用户管理-授权-弹出用户权限表单
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import { Modal, Transfer, Icon } from 'antd';
import PropTypes from 'prop-types';

export default class UserRole extends PureComponent {
  static defaultProps = {
    visible: false,
    confirmLoading: false,
    data: {},
    onOk: () => {
    },
    onCancel: () => {
    },
  };
  static contextTypes = {
    data: PropTypes.object,
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {
    targetKeys: [],
  };

  componentDidMount() {
    this.setTargetKeys();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data: { selectRoleIds } } = nextProps;
    this.setState({
      targetKeys: selectRoleIds,
    });
  }

  setTargetKeys = () => {
    this.setState({
      targetKeys: this.props.data.selectRoleIds,
    });
  };

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };

  handleOk = () => {
    const { onOk, data: { userId } } = this.props;
    onOk({
      roleIds: this.state.targetKeys,
      userId,
    });
  };

  render() {
    const { visible, onCancel, data, confirmLoading } = this.props;
    const { targetKeys } = this.state;

    return (
      <Modal
        title={<div><Icon type="swap" /> 授权</div>}
        visible={visible}
        okText='保存'
        cancelText='取消'
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Transfer
          dataSource={data.allRoles}
          titles={['未分配权限', '已分配权限']}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
        />
      </Modal>
    );
  }
}
