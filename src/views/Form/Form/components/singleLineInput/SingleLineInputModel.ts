import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase } from '../base';

export type SingleLineInputValueData = string;

export interface SingleLineInputData extends FormComponentModelDataBase {
  placeholder: SingleLineInputValueData;
  defaultValue: SingleLineInputValueData;
}

/**
 * 单行文字
 */
export class SingleLineInputModel extends FormComponentModel implements SingleLineInputData {
  placeholder: string;
  defaultValue: SingleLineInputValueData;

  value: SingleLineInputValueData;
  constructor(data?: SingleLineInputData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'SingleLineInput',
      title = '单行文字',
      size,
      placeholder = '请输入',
      defaultValue = '',
      layout,
    } = data ?? {};
    super({ id, type, title, size, layout });

    this.placeholder = placeholder;
    this.defaultValue = defaultValue;

    this.value = defaultValue;
  }

  getModel(): SingleLineInputData {
    return { ...super.getModel(), defaultValue: this.defaultValue, placeholder: this.placeholder };
  }

  getValueData(): SingleLineInputValueData {
    return this.value;
  }
}
