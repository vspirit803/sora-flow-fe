import { FormComponentModel } from '../base';

/**
 * 单选框
 */
export class MultiplySelectModel extends FormComponentModel {
  default: Array<string>;
  options: Array<string>;
  direction: string;
  constructor() {
    super('MultiplySelect', '多项选择');
    this.default = ['选项1', '选项2'];
    this.options = ['选项1', '选项2', '选项3'];
    this.direction = 'vertical';
  }

  addOption(optionName = '未命名') {
    this.options.push(optionName);
  }

  getData() {
    return { ...super.getData(), default: this.default, options: this.options };
  }
}
