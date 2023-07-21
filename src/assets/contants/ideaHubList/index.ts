import merge from 'lodash/merge';
import base from './base.json';
import zh_CN from './zh_CN.json';
import en_GB from './en_GB.json';

interface SourceType {
  [key: string]: any;
}

const source: SourceType = {
  zh_CN,
  en_GB,
};

// 获取对象语言环境下的创意中心的配置数据
export default (params?: string) => {
  const locale: string = params || 'en_GB';
  return (source[locale] || []).map((baseElement: any, index: number) => merge({}, baseElement, base[index]));
};
