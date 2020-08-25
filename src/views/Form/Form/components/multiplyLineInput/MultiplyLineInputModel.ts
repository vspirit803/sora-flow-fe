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
  value: string;
  constructor(data?: MultiplyLineInputData) {
    const {
      type = 'MultiplyLineInput',
      title = '多行文字',
      size,
      placeholder = '请输入',
      defaultValue = '',
      rowNumber = 3,
      layout,
    } = data ?? {};
    super({ type, title, size, layout });

    this.placeholder = placeholder;
    this.defaultValue = defaultValue;
    this.rowNumber = rowNumber;

    this.value = defaultValue;
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
