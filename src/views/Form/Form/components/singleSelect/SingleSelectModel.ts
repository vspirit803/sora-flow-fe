import { FormComponentModel } from '../base';

/**
 * 单选框
 */
export class SingleSelectModel extends FormComponentModel {
  default: string;
  options: Array<{ value: string; symbol: symbol }>;
  direction: 'vertical' | 'horizontal';
  constructor() {
    super('SingleSelect', '单项选择');
    this.default = '';
    this.options = [
      { value: '选项1', symbol: Symbol('选项') },
      { value: '选项2', symbol: Symbol('选项') },
      { value: '选项3', symbol: Symbol('选项') },
    ];
    this.direction = 'vertical';
  }

  addOption(optionName = '未命名') {
    this.options.push({ value: optionName, symbol: Symbol('选项') });
  }

  getData() {
    return { ...super.getData(), default: this.default, options: this.options };
  }
}
