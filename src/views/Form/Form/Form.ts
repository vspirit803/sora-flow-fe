import { FormComponentDataBase } from './components';
import { FormRow } from './FormRow';

/**
 * 表单
 */
export class Form {
  rows: Array<FormRow>;
  constructor(data: Array<Array<FormComponentDataBase>> = []) {
    this.rows = [];
    if (data.length) {
      data.forEach((eachRow) => {
        const currRow = new FormRow(eachRow);
        this.addRow(currRow);
      });
    }
  }

  get data(): Array<Array<FormComponentDataBase>> {
    return this.rows.map((each) => each.data);
  }

  getPrevRow(row: FormRow): FormRow | undefined {
    const index = this.rows.findIndex((each) => each === row);
    if (index === -1 || row.form !== this) {
      throw new Error('无效的row参数');
    }
    if (index > 0) {
      return this.rows[index - 1];
    }
    return undefined;
  }

  getNextRow(row: FormRow): FormRow | undefined {
    const index = this.rows.findIndex((each) => each === row);
    if (index === -1 || row.form !== this) {
      throw new Error('无效的row参数');
    }
    if (index < this.rows.length - 1) {
      return this.rows[index + 1];
    }
    return undefined;
  }

  /**
   *
   * @param row 要添加的行
   * @param reference 添加到哪一行后面
   */
  addRow(row: FormRow, reference?: FormRow): void;
  /**
   *
   * @param row 要添加的行
   * @param reference 要添加到的index
   */
  addRow(row: FormRow, reference?: number): void;
  addRow(row: FormRow, reference?: FormRow | number): void {
    let index = this.rows.length;
    if (reference !== undefined) {
      if (typeof reference === 'number') {
        index = reference - 1;
      } else {
        index = this.rows.indexOf(reference);
      }
    }
    this.rows.splice(index + 1, 0, row);
    row.form = this;
  }

  removeRow(row: FormRow): void {
    if (!this.rows.includes(row) || row.form !== this) {
      throw new Error('无法移除不在此表单的行');
    }
    const index = this.rows.indexOf(row);
    this.rows.splice(index, 1);
  }
}
