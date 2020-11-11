import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase, OptionColor } from '../base';

export type MutiplySelectValueData = Array<string>;

export interface MultiplySelectData extends FormComponentModelDataBase {
  defaultValue: MutiplySelectValueData;
  options: Array<{ value: string; text: string; color: OptionColor }>;
  direction: 'vertical' | 'horizontal';
  mode: 'dropdown' | 'tiled';
}

/**
 * 多选框
 */
export class MultiplySelectModel extends FormComponentModel implements MultiplySelectData {
  defaultValue: MutiplySelectValueData;
  options: Array<{ value: string; text: string; color: OptionColor }>;
  direction: 'vertical' | 'horizontal';
  mode: 'dropdown' | 'tiled';

  value: MutiplySelectValueData;
  constructor(data?: MultiplySelectData, value?: MutiplySelectValueData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'MultiplySelect',
      title = '多项选择',
      size,
      defaultValue = [],
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

    this.defaultValue = [...defaultValue];
    this.options = options;
    this.direction = direction;
    this.mode = mode;

    this.value = [...(value ?? defaultValue)];
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: new ObjectID().toHexString(), text: optionName, color: 'primary' });
  }

  getModel(): MultiplySelectData {
    return {
      ...super.getModel(),
      defaultValue: this.defaultValue,
      options: this.options.map((each) => ({ ...each })),
      direction: this.direction,
      mode: this.mode,
    };
  }

  getValueData(): MutiplySelectValueData {
    return [...this.value];
  }
}
