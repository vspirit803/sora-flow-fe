import { FormComponentDataBase, FormComponentModel } from '../base';

export interface MultiplySelectData extends FormComponentDataBase {
  defaultValue: Array<string>;
  options: Array<{ value: string; symbol: symbol }>;
  direction: 'vertical' | 'horizontal';
}
/**
 * 多选框
 */
export class MultiplySelectModel extends FormComponentModel implements MultiplySelectData {
  defaultValue: Array<string>;
  options: Array<{ value: string; symbol: symbol }>;
  direction: 'vertical' | 'horizontal';

  value: Array<string>;
  constructor(data?: MultiplySelectData) {
    const {
      type = 'MultiplySelect',
      title = '多项选择',
      size,
      defaultValue = [],
      options = [
        { value: '选项1', symbol: Symbol('选项') },
        { value: '选项2', symbol: Symbol('选项') },
        { value: '选项3', symbol: Symbol('选项') },
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
    this.options.push({ value: optionName, symbol: Symbol('选项') });
  }

  getModel(): MultiplySelectData {
    return { ...super.getModel(), defaultValue: this.defaultValue, options: this.options, direction: this.direction };
  }
}
