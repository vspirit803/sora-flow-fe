import { FormComponentModel } from '../base';
import { MultiplyLineInputModel } from '../multiplyLineInput';
import { MultiplySelectModel } from '../multiplySelect';
import { SingleLineInputModel } from '../singleLineInput';
import { SingleSelectModel } from '../singleSelect';

/**
 * 表单组件-表格
 */
export class TableModel extends FormComponentModel {
  fields: Array<FormComponentModel>;
  rowNumber: number;

  constructor() {
    super('Table', '表格');
    this.fields = [];
    this.rowNumber = 1;

    const nameField = new SingleLineInputModel();
    nameField.title = '姓名';
    nameField.size = 6;
    this.fields.push(nameField);

    const sexField = new SingleSelectModel();
    sexField.title = '性别';
    sexField.size = 6;
    sexField.options = [
      { value: '男', symbol: Symbol('选项') },
      { value: '女', symbol: Symbol('选项') },
    ];
    sexField.direction = 'horizontal';
    this.fields.push(sexField);
  }

  addField(name: string) {
    let model;
    switch (name) {
      case 'SingleLineInput':
        model = new SingleLineInputModel();
        break;
      case 'MultiplyLineInput':
        model = new MultiplyLineInputModel();
        break;
      case 'SingleSelect':
        model = new SingleSelectModel();
        break;
      case 'MultiplySelect':
        model = new MultiplySelectModel();
        break;
      default:
        throw new Error(`名为[${name}]的组件未注册`);
    }
    model.setSize(6);
    this.fields.push(model);
  }

  getData() {
    return { ...super.getData(), fields: this.fields.map((each) => each.getData()), rowNumber: this.rowNumber };
  }

  onRemoveField(field: FormComponentModel) {
    this.fields = this.fields.filter((each) => each !== field);
  }
}
