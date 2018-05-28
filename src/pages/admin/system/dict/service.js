/**
 * 数据字典
 * Created by penghuicong on 2017/12/12.
 */
import { GET, POST, PUT, DELETE, COMPLEX_DELETE } from 'utils/request';

export function getDictTypeList() {
  return GET('/dict/type/list');
}

export function addDictType(postData) {
  return POST('/dict/type', postData);
}

export function editDictType(postData) {
  return PUT('/dict/type', postData);
}

export function getDictTypeInfo(id) {
  return GET(`/dict/type/${id}`);
}

export function delDictType(id) {
  return DELETE(`/dict/type/${id}`);
}

export function getDictList(payload) {
  return GET('/dict/list', payload);
}

export function addDict(postData) {
  return POST('/dict', postData);
}

export function editDict(postData) {
  return PUT('/dict', postData);
}

export function getDictInfo(id) {
  return GET(`/dict/${id}`);
}

export function delDict(id) {
  return DELETE(`/dict/${id}`);
}

export function batchDelete(ids) {
  return COMPLEX_DELETE('/dict/list', ids);
}

export function refreshCache() {
  return DELETE('/dict/cache');
}

