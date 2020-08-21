import { FormComponentDataBase, FormComponentModel } from '../base';

export interface SingleLineInputData extends FormComponentDataBase {
  placeholder: string;
  defaultValue: string;
}
/**
 * 单行文字
 */
export class SingleLineInputModel extends FormComponentModel implements SingleLineInputData {
  placeholder: string;
  defaultValue: string;
  constructor(data?: SingleLineInputData) {
    const { type = 'SingleLineInput', title = '单行文字', size, placeholder = '请输入', defaultValue = '', layout } =
      data ?? {};
    super({ type, title, size, layout });

    this.placeholder = placeholder;
    this.defaultValue = defaultValue;
  }

  getModel(): SingleLineInputData {
    return { ...super.getModel(), defaultValue: this.defaultValue, placeholder: this.placeholder };
  }
}
