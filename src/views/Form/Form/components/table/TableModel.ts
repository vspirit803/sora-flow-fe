import { FormComponentDataBase, FormComponentModel } from '../base';
import { ComponentFactory } from '../ComponentFactory';
import { FormComponentType } from '../FormComponents';

export interface TableData extends FormComponentDataBase {
  fields: Array<FormComponentDataBase>;
  rowNumber: number;
}
/**
 * 表单组件-表格
 */
export class TableModel extends FormComponentModel implements TableData {
  fields: Array<FormComponentModel>;
  rowNumber: number;

  constructor(data?: TableData) {
    const {
      type = 'Table',
      title = '表格',
      size,
      fields = [
        { type: 'SingleLineInput', title: '姓名' },
        {
          type: 'SingleSelect',
          title: '性别',
          options: [
            { value: '男', symbol: Symbol('选项') },
            { value: '女', symbol: Symbol('选项') },
          ],
          defaultValue: '',
          direction: 'horizontal',
        },
      ] as Array<FormComponentDataBase>,
      rowNumber = 1,
    } = data ?? {};
    super({ type, title, size });

    this.rowNumber = rowNumber;
    this.fields = fields.map((eachField) => {
      return ComponentFactory.create(eachField);
    });
  }

  addField(type: FormComponentType): void {
    const component = ComponentFactory.create({ type, size: 6 });
    this.fields.push(component);
  }

  getModel(): TableData {
    return { ...super.getModel(), fields: this.fields.map((each) => each.getModel()), rowNumber: this.rowNumber };
  }

  onRemoveField(field: FormComponentModel): void {
    this.fields = this.fields.filter((each) => each !== field);
  }
}
