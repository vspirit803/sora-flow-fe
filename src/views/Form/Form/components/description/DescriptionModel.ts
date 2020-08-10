import { FormComponentDataBase, FormComponentModel } from '../base';

export interface DescriptionData extends FormComponentDataBase {
  text: string;
}
/**
 * 表单组件-描述文字
 */
export class DescriptionModel extends FormComponentModel implements DescriptionData {
  text: string;
  constructor(data?: DescriptionData) {
    const { type = 'Description', title = '描述文字', size, text = '' } = data ?? {};
    super({ type, title, size });

    this.text = text;
  }

  getModel(): DescriptionData {
    return { ...super.getModel(), text: this.text };
  }
}
