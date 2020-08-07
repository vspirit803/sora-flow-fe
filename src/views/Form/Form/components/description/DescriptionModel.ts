import { FormComponentDataBase, FormComponentModel } from '../base';

export interface DescriptionData extends FormComponentDataBase {
  text: string;
}
/**
 * 表单组件-描述文字
 */
export class DescriptionModel extends FormComponentModel implements DescriptionData {
  text: string;
  constructor() {
    super('Description', '描述文字');
    this.text = '';
  }

  getData(): FormComponentDataBase {
    return { ...super.getData(), text: this.text };
  }
}
