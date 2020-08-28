import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase } from '../base';

export interface DescriptionData extends FormComponentModelDataBase {
  text: string;
}
/**
 * 表单组件-描述文字
 */
export class DescriptionModel extends FormComponentModel implements DescriptionData {
  text: string;
  constructor(data?: DescriptionData) {
    const { id = new ObjectID().toHexString(), type = 'Description', title = '描述文字', size, text = '' } = data ?? {};
    super({ id, type, title, size });

    this.text = text;
  }

  getModel(): DescriptionData {
    return { ...super.getModel(), text: this.text };
  }
}
