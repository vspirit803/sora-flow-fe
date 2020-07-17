import { FormComponentModel } from '../base';

/**
 * 表单组件-表格
 */
export class TableModel extends FormComponentModel {
  constructor() {
    super('Table', '表格');
  }

  getData() {
    return { ...super.getData() };
  }
}
