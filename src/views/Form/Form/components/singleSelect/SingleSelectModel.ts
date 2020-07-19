import { FormComponentModel } from '../base';

/**
 * 单选框
 */
export class SingleSelectModel extends FormComponentModel {
  default: string;
  options: Array<string>;
  direction: 'vertical' | 'horizontal';
  constructor() {
    super('SingleSelect', '单项选择');
    this.default = '';
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
