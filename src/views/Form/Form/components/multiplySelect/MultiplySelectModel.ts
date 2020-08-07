import { FormComponentDataBase, FormComponentModel } from '../base';

/**
 * 单选框
 */
export class MultiplySelectModel extends FormComponentModel {
  default: Array<string>;
  options: Array<{ value: string; symbol: symbol }>;
  direction: string;
  constructor() {
    super('MultiplySelect', '多项选择');
    this.default = [];
    this.options = [
      { value: '选项1', symbol: Symbol('选项') },
      { value: '选项2', symbol: Symbol('选项') },
      { value: '选项3', symbol: Symbol('选项') },
    ];
    this.direction = 'vertical';
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: optionName, symbol: Symbol('选项') });
  }

  getData(): FormComponentDataBase {
    return { ...super.getData(), default: this.default, options: this.options };
  }
}
