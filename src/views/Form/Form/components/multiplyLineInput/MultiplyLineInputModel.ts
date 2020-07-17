import { FormComponentModel } from '../base';

/**
 * 多行文本
 */
export class MultiplyLineInputModel extends FormComponentModel {
  placeholder: string;
  default: string;
  rowNumber: number;
  constructor() {
    super('MultiplyLineInput', '多行文字');
    this.placeholder = '请输入';
    this.default = '';
    this.rowNumber = 3;
  }

  getData() {
    return { ...super.getData(), rowNumber: this.rowNumber, default: this.default };
  }
}
