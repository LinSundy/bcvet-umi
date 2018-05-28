/**
 * 数据字典
 * Created by penghuicong on 2017/12/12.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import DictTypeList from './components/DictTypeList'; // 字典类型列表
import DictTypeForm from './components/DictTypeForm'; // 字典类型新增编辑
import DictOperate from './components/DictOperate'; // 字典数据操作区域
import DictList from './components/DictList'; // 字典数据
import DictForm from './components/DictForm'; // 新增，编辑字典数据
import DictSearch from './components/DictSearch'; // 搜索区
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import styles from 'assets/less/admin.less';

@connect(state => ({
  dict: state.dict,
  modal: state.modal,
}))

export default class DictRoute extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'dict/fetchDictType',
    });
    this.props.dispatch({
      type: 'dict/fetchDictList',
      payload: {},
    });
  }

  // 多选的key值和整行的数据
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  // 页码change
  onPageChange = (params) => {
    this.props.dispatch({
      type: 'dict/fetchDictList',
      payload: params,
    });
  };

  // 刷新缓存
  onRefresh = () => {
    this.props.dispatch({
      type: 'dict/refreshCache',
    });
  };

  // 获取字典数据
  getDictList = (typeId) => {
    this.props.dispatch({
      type: 'dict/fetchDictListByType',
      payload: {
        pageNum: 1,
        typeId,
      },
    });
  };

  // 显示新增字典类型弹窗
  showDictTypeModal = () => {
    this.props.dispatch({
      type: 'modal/showModal',
      payload: {
        type: 'add',
      },
    });
  };

  // 提交新增字典类型
  addDictType = (data) => {
    this.props.dispatch({
      type: 'dict/addDictType',
      payload: data,
    });
  };

  // 显示编辑字典类型弹窗
  showEditDictTypeModal = (id) => {
    this.props.dispatch({
      type: 'dict/showDictTypeEditModal',
      payload: {
        type: 'edit',
        id,
      },
    });
  };

  // 提交编辑字典类型
  editDictType = (data) => {
    this.props.dispatch({
      type: 'dict/editDictType',
      payload: data,
    });
  };

  // 删除字典类型
  delDictType = (id) => {
    this.props.dispatch({
      type: 'dict/delDictType',
      payload: id,
    });
  };

  // 隐藏字典类型弹窗
  hideDictTypeModal = () => {
    this.props.dispatch({
      type: 'modal/hideModal',
    });
  };

  // 搜索
  handleSearch = (values) => {
    this.props.dispatch({
      type: 'dict/fetchDictList',
      payload: {
        values,
        pageNum: 1,
      },
    });
  };

  // 显示新增字典数据弹框
  showDictModal = () => {
    this.props.dispatch({
      type: 'dict/showAddModal',
      payload: {
        modalType: 'add',
      },
    });
  };

  // 提交新增字典数据
  addDictData = (postData) => {
    this.props.dispatch({
      type: 'dict/addDict',
      payload: postData,
    });
  };

  // 显示编辑字典数据弹框
  showEditDictModal = (id) => {
    this.props.dispatch({
      type: 'dict/showEditModal',
      payload: {
        id,
        modalType: 'edit',
      },
    });
  };

  // 提交编辑字典数据
  editDictData = (postData) => {
    this.props.dispatch({
      type: 'dict/editDict',
      payload: postData,
    });
  };

  // 隐藏新增编辑字典数据弹框
  hideDictModal = () => {
    this.props.dispatch({
      type: 'dict/hideDictModal',
    });
    this.props.dispatch({
      type: 'modal/hideModal',
    });
  };

  // 删除字典数据
  handleDeleteDict = (id) => {
    this.props.dispatch({
      type: 'dict/delDict',
      payload: id,
    });
  };

  // 删除之后清除selectedRowKeys,selectedRows
  clearSelect = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  // 批量删除
  handleBatchDelete = (ids, callback) => {
    this.props.dispatch({
      type: 'dict/batchDeleteDict',
      payload: {
        ids,
        callback,
      },
    });
  };


  render() {
    const {
      dict: {
        dictTypeList, dictList, pageSize, pageNum,
        total, loading, values = {}, addVisible, modalType,
        typeId,
      },
    } = this.props;
    const { modal: { type, visible, confirmLoading, curItem } } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;


    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <PageHeaderLayout>
        <Row gutter={24}>
          <Col span={6}>
            <DictTypeList
              typeId={typeId}
              dictTypeList={dictTypeList}
              onAdd={this.showDictTypeModal}
              onEdit={this.showEditDictTypeModal}
              onDelete={this.delDictType}
              getList={this.getDictList}
            />
          </Col>
          <Col span={18}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <DictSearch
                  onSearch={this.handleSearch}
                  onRest={this.handleSearch}
                  values={values}
                />
                <DictOperate
                  selectedRowKeys={selectedRowKeys}
                  selectedRows={selectedRows}
                  onAdd={this.showDictModal}
                  onBatchDelete={this.handleBatchDelete}
                  clearSelect={this.clearSelect}
                  onRefresh={this.onRefresh}
                />
                <DictList
                  loading={loading}
                  dictList={dictList}
                  rowSelection={rowSelection}
                  changePage={this.onPageChange}
                  pageSize={pageSize}
                  pageNum={pageNum}
                  total={total}
                  onEdit={this.showEditDictModal}
                  onDelete={this.handleDeleteDict}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <DictTypeForm
          visible={visible}
          confirmLoading={confirmLoading}
          type={type}
          onCancel={this.hideDictTypeModal}
          onAdd={this.addDictType}
          onEdit={this.editDictType}
          curItem={curItem}
        />
        <DictForm
          addVisible={addVisible}
          confirmLoading={confirmLoading}
          modalType={modalType}
          curItem={curItem}
          dictTypeList={dictTypeList}
          onAdd={this.addDictData}
          onCancel={this.hideDictModal}
          onEdit={this.editDictData}
        />
      </PageHeaderLayout>
    );
  }
}

