import { ObjectID } from 'bson';

import { FormComponentModel, FormComponentModelDataBase, FormComponentValueDataBase } from '../base';
import { ComponentFactory } from '../ComponentFactory';
import { FormComponentType } from '../FormComponents';

/**表格一行的数据 */
export type TableRowValueData = {
  id: string;
  data: Record<string, FormComponentValueDataBase>;
};

/**表格数据 */
export type TableValueData = Array<TableRowValueData>;

/**表格的模型数据 */
export interface TableData extends FormComponentModelDataBase {
  fields: Array<FormComponentModelDataBase>;
  rowNumber: number;

  value?: TableValueData;
}
/**
 * 表单组件-表格
 */
export class TableModel extends FormComponentModel implements TableData {
  fields: Array<FormComponentModel>;
  rowNumber: number;
  value: TableValueData;

  constructor(data?: TableData) {
    const {
      id = new ObjectID().toHexString(),
      type = 'Table',
      title = '表格',
      size,
      fields = [
        { type: 'SingleLineInput', title: '姓名' },
        {
          type: 'SingleSelect',
          title: '性别',
          options: [
            { value: new ObjectID().toHexString(), text: '男' },
            { value: new ObjectID().toHexString(), text: '女' },
          ],
          defaultValue: '',
          direction: 'horizontal',
        },
      ] as Array<FormComponentModelDataBase>,
      rowNumber = 1,

      value = [],
    } = data ?? {};
    super({ id, type, title, size });

    this.rowNumber = rowNumber;
    this.fields = fields.map((eachField) => {
      return ComponentFactory.create(eachField);
    });
    this.value = [];

    for (let i = 0; i < this.rowNumber; i++) {
      const currRow: TableRowValueData = { id: new ObjectID().toHexString(), data: {} };
      this.fields.forEach((each) => {
        const id = each.id;
        currRow.data[id] = ComponentFactory.create(each.model);
        if (value[i]?.data?.[id] && 'value' in currRow.data[id]) {
          currRow.data[id].value = value[i].data?.[id];
        }
      });
      this.value.push(currRow);
    }
  }

  addField(type: FormComponentType): void {
    const component = ComponentFactory.create({ type, size: 6 });
    this.fields.push(component);
  }

  getModel(): TableData {
    return { ...super.getModel(), fields: this.fields.map((each) => each.getModel()), rowNumber: this.rowNumber };
  }

  getValueData(): TableValueData {
    return this.value.map((eachRow) => {
      const currRow: TableRowValueData = { id: eachRow.id, data: {} };
      Object.entries(eachRow.data).forEach(([key, value]) => {
        currRow.data[key] = value.valueData;
      });
      return currRow;
    });
  }

  onRemoveField(field: FormComponentModel): void {
    this.fields = this.fields.filter((each) => each !== field);
  }
}
