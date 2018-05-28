import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { GET } from 'utils/request';

const getDictList = (type) => {
  return GET(`/dict/type/${type}/list`);
};

export default class BnDict extends Component {
  static contextTypes = {
    defaultValue: PropTypes.string, // 默认值
    onChange: PropTypes.func, // 改变时调用的方法
    name: PropTypes.string, // 字典名称
    type: PropTypes.string, // 字典id
    dictType: PropTypes.string, // 字典查询的类型是select/view
    value: PropTypes.string, // 数据字典的value值
    defaultName: PropTypes.string, // option默认第一个展示的名字
    showFirst: PropTypes.bool,
    filterData: PropTypes.array, // 要过滤掉的数据，格式：['xx', 'xxx']，详见TrainWorkAllList.js
  };

  constructor(props) {
    super(props);
    this.state = {
      dictval: '',
      dictSelectOptions: [],
    };
    this.initialize = this.initialize.bind(this);
    this.renderDictView = this.renderDictView.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.renderDictSelectOptions = this.renderDictSelectOptions.bind(this);
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    this.setValues();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const value = nextProps.value || nextProps.defaultValue;
    this.setState({
      value,
    }, () => {
      if (nextProps.dictType === 'select') {
        // 渲染select，然后设置选中值
        this.renderDictSelectOptions();
      } else if (nextProps.dictType === 'view') {
        // 渲染view
        this.renderDictView();
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onChange() {
    this.props.onChange && this.props.onChange(this.refs.dictsVal.getValue());
  }

  setValues = () => {
    const value = this.props.value || this.props.defaultValue;
    this.setState({
      value,
    }, this.initialize);
  };

  getValue() {
    return this.refs.dictsVal ? this.refs.dictsVal.getValue() : null;
  }

  setValue(value) {
    this.refs.dictsVal && this.refs.dictsVal.setValue(value || '');
  }

  valid() {
    return this.refs.dictsVal ? this.refs.dictsVal.valid() : true;
  }

  initialize() {
    if (Object.keys(BnDict.allDict[this.props.type] || []).length === 0) {
      if (!BnDict.reading[this.props.type]) {
        BnDict.reading[this.props.type] = true;
        getDictList(this.props.type).then((data) => {
          if (data.success) {
            if (!_.isArray(data.obj) || _.isEmpty(data.obj)) {
              return;
            }
            BnDict.allDict[this.props.type] = data.obj;
            BnDict.callbacks[this.props.type]
              && BnDict.callbacks[this.props.type].forEach((func) => {
                func();
              });
            _.remove(BnDict.callbacks[this.props.type]);
            BnDict.reading[this.props.type] = false;// 无必要，为了语义明确而加的赋值。
          }
        });
      }
      if (!BnDict.callbacks[this.props.type]) {
        BnDict.callbacks[this.props.type] = [];
      }
      BnDict.callbacks[this.props.type].push(() => {
        this.initialize();
      });
      return;
    }
    if (this.props.dictType === 'select') {
      // 渲染select，然后设置选中值
      this.renderDictSelectOptions();
    } else if (this.props.dictType === 'view') {
      // 渲染view
      this.renderDictView();
    }
  }

  // 渲染字典下拉框选项
  renderDictSelectOptions() {
    let { value } = this.state;
    let firstValue;
    const dictSelectOptions = (
      BnDict.allDict[this.props.type] && BnDict.allDict[this.props.type].map((item, index) => {
        if (index === 0) {
          firstValue = item.value;
        }
        if (!(this.props.filterData && _.isArray(this.props.filterData)
            && _.includes(this.props.filterData, item.value))) {
          return (<option key={index} value={item.value}> {item.label} </option>);
        }

        return item;
      })
    );

    // 渲染下拉框，然后设置选中值
    this.setState({
      dictSelectOptions,
    }, () => {
      if (!dictSelectOptions) {
        return;
      }
      if (this.props.showFirst) {
        value = firstValue;
      }
      this.setValue(value);
    }
    );
  }

  // 获得某个字典类型下value对应的label，渲染view
  renderDictView() {
    const { value } = this.state;
    if (!value) {
      return;
    }
    const dictval = _.result(_.find(BnDict.allDict[this.props.type], { value }), 'label');
    if (this.mounted) {
      this.setState({
        dictval,
      });
    }
  }

  render() {
    if (this.props.dictType === 'view') {
      return (<section>{this.state.dictval}</section>);
    } else if (this.props.dictType === 'viewList') {
      return (<section>{this.state.dictSelectOptions}</section>);
    }
    return '';
  }
}

BnDict.defaultProps = {
  defaultName: '请选择',
  showFirst: false,
};

BnDict.allDict = {};
BnDict.reading = {};
BnDict.callbacks = {};

export function getDictLabel(type, value) {
  return <BnDict name="dictView" dictType="view" type={type} value={value} />;
}
