import { FormRow } from '../../FormRow';

/**
 * 表单组件基类
 */
export class FormComponentModel {
  type: string;
  title: string;
  isSelected: boolean;
  size: number;
  _row?: FormRow;
  constructor(type: string, title: string) {
    this.type = type;
    this.title = title;
    this.size = 12;
    this.isSelected = false;
  }

  setSize(size: number) {
    this.size = size;
  }

  changeSize(size: number) {
    this.setSize(size);
    this.row.resize();
  }

  get data() {
    return this.getData();
  }

  getData() {
    return { type: this.type, title: this.title, size: this.size };
  }

  /**切换选中状态 */
  toggleSelect() {
    this.isSelected = !this.isSelected;
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

  swapToLeft() {
    if (!this.canSwapToLeft) {
      throw new Error('无法与左边组件交换位置');
    }
    this.row.swapComponent(this, 'left');
  }

  swapToRight() {
    if (!this.canSwapToRight) {
      throw new Error('无法与右边组件交换位置');
    }
    this.row.swapComponent(this, 'right');
  }

  moveToPrevRow() {
    if (!this.canMoveToPrevRow) {
      throw new Error('上一行不存在或已满,无法添加新组件');
    }
    const prevRow = this.prevRow!;
    this.row.removeComponent(this);
    this._row = undefined;
    prevRow.addComponent(this);
  }

  moveToNextRow() {
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

    // const nextRow = this.nextRow

    // if (nextRow) {
    //   this.row.removeComponent(this)
    //   this._row = undefined
    //   nextRow.addComponent(this)
    // }
  }

  remove() {
    this.row.removeComponent(this);
    this._row = undefined;
  }

  get prevRow() {
    return this.row.prevRow;
  }

  get nextRow() {
    return this.row.nextRow;
  }

  clearRow() {
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
