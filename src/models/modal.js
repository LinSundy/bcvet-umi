
export default {
  namespace: 'modal',
  state: {
    visible: false,
    type: 'create',
    curItem: {},
    confirmLoading: false,
  },
  reducers: {
    showModal(state, action) {
      return { ...state, visible: true, ...action.payload };
    },
    confirmLoading(state, action) {
      const { confirmLoading } = action.payload;
      return { ...state, confirmLoading };
    },
    hideModal(state) {
      return { ...state, visible: false, loading: false, confirmLoading: false, curItem: {} };
    },
    setItem(state, action) {
      const { curItem } = action.payload;
      return { ...state, curItem };
    },
  },
};
