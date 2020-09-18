import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase, OptionColor } from '../base';

export type SingleSelectValueData = string;

export interface SingleSelectData extends FormComponentModelDataBase {
  defaultValue: SingleSelectValueData;
  options: Array<{ value: string; text: string; color: OptionColor }>;
  direction: 'vertical' | 'horizontal';
  mode: 'dropdown' | 'tiled';
}

/**
 * 单选框
 */
export class SingleSelectModel extends FormComponentModel implements SingleSelectData {
  defaultValue: SingleSelectValueData;
  options: Array<{ value: string; text: string; color: OptionColor }>;
  direction: 'vertical' | 'horizontal';
  mode: 'dropdown' | 'tiled';

  value: SingleSelectValueData;
  constructor(data?: SingleSelectData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'SingleSelect',
      title = '单项选择',
      size,
      defaultValue = '',
      options = [
        { value: new ObjectID().toHexString(), text: '选项1', color: 'primary' },
        { value: new ObjectID().toHexString(), text: '选项2', color: 'primary' },
        { value: new ObjectID().toHexString(), text: '选项3', color: 'primary' },
      ],
      direction = 'vertical',
      mode = 'tiled',
      layout,
    } = data ?? {};
    super({ id, type, title, size, layout });

    this.defaultValue = defaultValue;
    this.options = options;
    this.direction = direction;
    this.mode = mode;
    this.value = defaultValue;
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: new ObjectID().toHexString(), text: optionName, color: 'primary' });
  }

  getModel(): SingleSelectData {
    return {
      ...super.getModel(),
      defaultValue: this.defaultValue,
      options: this.options.map((each) => ({ ...each })),
      direction: this.direction,
      mode: this.mode,
    };
  }

  getValueData(): SingleSelectValueData {
    return this.value;
  }
}
