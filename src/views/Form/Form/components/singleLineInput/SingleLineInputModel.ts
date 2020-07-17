import { FormComponentModel } from '../base';

/**
 * 单行文字
 */
export class SingleLineInputModel extends FormComponentModel {
  placeholder: string;
  default: string;
  constructor() {
    super('SingleLineInput', '单行文字');
    this.placeholder = '请输入';
    this.default = '';
  }

  getData() {
    return { ...super.getData(), default: this.default, placeholder: this.placeholder };
  }
}
