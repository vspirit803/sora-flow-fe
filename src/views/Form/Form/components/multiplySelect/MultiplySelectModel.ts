import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase } from '../base';

export type MutiplySelectValueData = Array<string>;

export interface MultiplySelectData extends FormComponentModelDataBase {
  defaultValue: MutiplySelectValueData;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';
}

/**
 * 多选框
 */
export class MultiplySelectModel extends FormComponentModel implements MultiplySelectData {
  defaultValue: MutiplySelectValueData;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';

  value: MutiplySelectValueData;
  constructor(data?: MultiplySelectData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'MultiplySelect',
      title = '多项选择',
      size,
      defaultValue = [],
      options = [
        { value: new ObjectID().toHexString(), text: '选项1' },
        { value: new ObjectID().toHexString(), text: '选项2' },
        { value: new ObjectID().toHexString(), text: '选项3' },
      ],
      direction = 'vertical',
      layout,
    } = data ?? {};
    super({ id, type, title, size, layout });

    this.defaultValue = [...defaultValue];
    this.options = options;
    this.direction = direction;

    this.value = [...defaultValue];
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: new ObjectID().toHexString(), text: optionName });
  }

  getModel(): MultiplySelectData {
    return {
      ...super.getModel(),
      defaultValue: this.defaultValue,
      options: this.options.map((each) => ({ ...each })),
      direction: this.direction,
    };
  }

  getValueData(): MutiplySelectValueData {
    return [...this.value];
  }
}
