import { ObjectID } from 'bson';

import { FormComponentDataBase, FormComponentModel } from '../base';

export interface SingleSelectData extends FormComponentDataBase {
  defaultValue: string;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';
}
/**
 * 单选框
 */
export class SingleSelectModel extends FormComponentModel implements SingleSelectData {
  defaultValue: string;
  options: Array<{ value: string; text: string }>;
  direction: 'vertical' | 'horizontal';

  value: string;
  constructor(data?: SingleSelectData) {
    const {
      type = 'SingleSelect',
      title = '单项选择',
      size,
      defaultValue = '',
      options = [
        { value: new ObjectID().toHexString(), text: '选项1' },
        { value: new ObjectID().toHexString(), text: '选项2' },
        { value: new ObjectID().toHexString(), text: '选项3' },
      ],
      direction = 'vertical',
      layout,
    } = data ?? {};
    super({ type, title, size, layout });

    this.defaultValue = defaultValue;
    this.options = options;
    this.direction = direction;

    this.value = defaultValue;
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: new ObjectID().toHexString(), text: optionName });
  }

  getModel(): SingleSelectData {
    return {
      ...super.getModel(),
      defaultValue: this.defaultValue,
      options: this.options.map((each) => ({ ...each })),
      direction: this.direction,
    };
  }
}
