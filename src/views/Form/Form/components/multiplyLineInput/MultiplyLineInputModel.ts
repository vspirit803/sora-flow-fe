import { FormComponentDataBase, FormComponentModel } from '../base';

export interface MultiplyLineInputData extends FormComponentDataBase {
  placeholder: string;
  defaultValue: string;
  rowNumber: number;
}
/**
 * 多行文本
 */
export class MultiplyLineInputModel extends FormComponentModel implements MultiplyLineInputData {
  placeholder: string;
  defaultValue: string;
  rowNumber: number;
  constructor(data?: MultiplyLineInputData) {
    const {
      type = 'MultiplyLineInput',
      title = '多行文字',
      size,
      placeholder = '请输入',
      defaultValue = '',
      rowNumber = 3,
    } = data ?? {};
    super({ type, title, size });

    this.placeholder = placeholder;
    this.defaultValue = defaultValue;
    this.rowNumber = rowNumber;
  }

  getModel(): MultiplyLineInputData {
    return {
      ...super.getModel(),
      rowNumber: this.rowNumber,
      defaultValue: this.defaultValue,
      placeholder: this.placeholder,
    };
  }
}
