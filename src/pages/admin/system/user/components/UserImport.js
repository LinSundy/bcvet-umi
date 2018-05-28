/**
 * 系统管理-用户管理-导入用户-弹出用户导入表单
 * @Author: wugw
 * @Date: 2017年11月23日 15:36:01
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Upload, Button, Icon } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
export default class UserImport extends PureComponent {
  static defaultProps = {
    visible: false,
    confirmLoading: false,
    onOk: () => {
    },
    onCancel: () => {
    },
  };
  static contextTypes = {
    visible: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    fileList: [],
    validateStatus: null,
    help: '',
  };

  handleOnOk = () => {
    const { onOk } = this.props;
    const { fileList } = this.state;
    if (!fileList || fileList.length <= 0) {
      this.setState({
        validateStatus: 'error',
        help: '请选择文件',
      });
      return;
    }
    this.setState({
      validateStatus: null,
      help: '',
    });
    const formData = new FormData();
    formData.append('file', fileList[0]);
    onOk(formData);
  };

  downloadTemplate = () => {
    window.open('/template/importUser.xls', '_blank');
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { visible, onCancel, confirmLoading } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;

    const props = {
      name: 'file',
      action: '',
      accept: '.xls,.xlsx',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState({
          fileList: [file],
        });
        this.setState({
          validateStatus: null,
          help: '',
        });
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <Modal
        title={(<div><Icon type="upload" /> 导入用户</div>)}
        visible={visible}
        okText='保存'
        cancelText='取消'
        maskClosable={false}
        onOk={this.handleOnOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        afterClose={() => resetFields()}
      >
        <Form>
          <FormItem label="下载模板：" hasFeedback {...formItemLayout}>
            <Button icon="download" onClick={this.downloadTemplate}>下载导入模板</Button>
          </FormItem>
          <FormItem
            label="上传用户："
            hasFeedback
            {...formItemLayout}
            validateStatus={this.state.validateStatus}
            help={this.state.help}
          >
            {getFieldDecorator('upload', {
              valuePropName: 'file',
              getValueFromEvent: this.normFile,
            })(
              <Upload {...props}>
                <Button type="primary" icon="upload">
                  选择文件
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
