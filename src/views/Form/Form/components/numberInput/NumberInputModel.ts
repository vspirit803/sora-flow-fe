import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase } from '../base';

export type NumberInputValueData = number;

export interface NumberInputData extends FormComponentModelDataBase {
  placeholder: string;
  defaultValue: NumberInputValueData | undefined;
}

/**
 * 数字
 */
export class NumberInputModel extends FormComponentModel implements NumberInputData {
  placeholder: string;
  defaultValue: NumberInputValueData | undefined;

  value: NumberInputValueData | undefined;
  constructor(data?: NumberInputData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'NumberInput',
      title = '数字',
      size,
      placeholder = '请输入',
      defaultValue,
      layout,
    } = data ?? {};
    super({ id, type, title, size, layout });

    this.placeholder = placeholder;
    this.defaultValue = defaultValue;

    this.value = defaultValue;
  }

  getModel(): NumberInputData {
    return { ...super.getModel(), defaultValue: this.defaultValue, placeholder: this.placeholder };
  }

  getValueData(): NumberInputValueData | undefined {
    return this.value;
  }
}
