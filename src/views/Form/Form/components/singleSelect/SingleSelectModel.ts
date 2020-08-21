import { FormComponentDataBase, FormComponentModel } from '../base';

export interface SingleSelectData extends FormComponentDataBase {
  defaultValue: string;
  options: Array<{ value: string; symbol: symbol }>;
  direction: 'vertical' | 'horizontal';
}
/**
 * 单选框
 */
export class SingleSelectModel extends FormComponentModel implements SingleSelectData {
  defaultValue: string;
  options: Array<{ value: string; symbol: symbol }>;
  direction: 'vertical' | 'horizontal';
  constructor(data?: SingleSelectData) {
    const {
      type = 'SingleSelect',
      title = '单项选择',
      size,
      defaultValue = '',
      options = [
        { value: '选项1', symbol: Symbol('选项') },
        { value: '选项2', symbol: Symbol('选项') },
        { value: '选项3', symbol: Symbol('选项') },
      ],
      direction = 'vertical',
      layout,
    } = data ?? {};
    super({ type, title, size, layout });

    this.defaultValue = defaultValue;
    this.options = options;
    this.direction = direction;
  }

  addOption(optionName = '未命名'): void {
    this.options.push({ value: optionName, symbol: Symbol('选项') });
  }

  getModel(): SingleSelectData {
    return { ...super.getModel(), defaultValue: this.defaultValue, options: this.options, direction: this.direction };
  }
}
