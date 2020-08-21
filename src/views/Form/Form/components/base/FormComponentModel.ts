import { FormRow } from '../../FormRow';
import { FormComponentType } from '../FormComponents';

export interface FormComponentDataBase {
  type: FormComponentType;
  title?: string;
  size?: number;
  layout?: 'vertical' | 'horizontal';
}
/**
 * 表单组件基类
 */
export class FormComponentModel {
  symbol: symbol;
  type: FormComponentType;
  title: string;
  size: number;
  layout: 'vertical' | 'horizontal';
  _row?: FormRow;
  constructor(data: FormComponentDataBase) {
    this.symbol = Symbol('type');
    const { type, title = '无标题', size = 12, layout = 'vertical' } = data;
    this.type = type;
    this.title = title;
    this.size = size;
    this.layout = layout;
  }

  setSize(size: number): void {
    this.size = size;
  }

  changeSize(size: number): void {
    this.setSize(size);
    this._row?.resize();
  }

  get model(): FormComponentDataBase {
    return this.getModel();
  }

  getModel(): FormComponentDataBase {
    return { type: this.type, title: this.title, size: this.size, layout: this.layout };
  }

  get canMoveToPrevRow(): boolean {
    return this.row.prevRow?.canAddComponent ?? false;
  }

  get canMoveToNextRow(): boolean {
    // return this.row.nextRow?.canAddComponent ?? true
    return this.row.components.length > 1;
  }

  get index(): number {
    return this.row.components.indexOf(this);
  }

  get canSwapToLeft(): boolean {
    return this.index > 0;
  }

  get canSwapToRight(): boolean {
    return this.index < this.row.components.length - 1;
  }

  swapToLeft(): void {
    if (!this.canSwapToLeft) {
      throw new Error('无法与左边组件交换位置');
    }
    this.row.swapComponent(this, 'left');
  }

  swapToRight(): void {
    if (!this.canSwapToRight) {
      throw new Error('无法与右边组件交换位置');
    }
    this.row.swapComponent(this, 'right');
  }

  moveToPrevRow(): void {
    if (!this.canMoveToPrevRow) {
      throw new Error('上一行不存在或已满,无法添加新组件');
    }
    const prevRow = this.prevRow!;
    this.row.removeComponent(this);
    this._row = undefined;
    prevRow.addComponent(this);
  }

  moveToNextRow(): void {
    if (!this.canMoveToNextRow) {
      // throw new Error('下一行已满,无法添加新组件')
      throw new Error('此行只有一个组件,无法移到下一行');
    }
    const oldRow = this.row;
    const form = oldRow.form;
    const newRow = new FormRow();
    this.row.removeComponent(this);
    this._row = undefined;
    newRow.addComponent(this);
    form.addRow(newRow, oldRow);
  }

  remove(): void {
    this.row.removeComponent(this);
    this._row = undefined;
  }

  get prevRow(): FormRow | undefined {
    return this.row.prevRow;
  }

  get nextRow(): FormRow | undefined {
    return this.row.nextRow;
  }

  clearRow(): void {
    this._row = undefined;
  }

  set row(row: FormRow) {
    this._row = row;
  }

  get row(): FormRow {
    if (!this._row) {
      throw new Error('在使用row前必须先设置');
    }
    return this._row;
  }
}
