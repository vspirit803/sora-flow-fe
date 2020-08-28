import { ObjectID } from 'bson';

import { FormComponentDataBase, FormComponentModel } from '../base';

export interface MultiplySelectData extends FormComponentDataBase {
  defaultValue: Array<string>;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';
}
/**
 * 多选框
 */
export class MultiplySelectModel extends FormComponentModel implements MultiplySelectData {
  defaultValue: Array<string>;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';

  value: Array<string>;
  constructor(data?: MultiplySelectData) {
    const {
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
    super({ type, title, size, layout });

    this.defaultValue = [...defaultValue];
    this.options = options;
    this.direction = direction;

    this.value = [...defaultValue];
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: new ObjectID().toHexString(), text: optionName });
  }

  getModel(): MultiplySelectData {
    return { ...super.getModel(), defaultValue: this.defaultValue, options: this.options, direction: this.direction };
  }
}
