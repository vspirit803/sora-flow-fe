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

  constructor() {
    super('Table', '表格');
    this.fields = [];

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

    const relationshipField = new SingleLineInputModel();
    relationshipField.title = '关系';
    relationshipField.size = 6;
    this.fields.push(relationshipField);

    const ageField = new SingleLineInputModel();
    ageField.title = '年龄';
    ageField.size = 6;
    this.fields.push(ageField);

    const workLocationField = new SingleLineInputModel();
    workLocationField.title = '工作地点';
    workLocationField.size = 6;
    this.fields.push(workLocationField);

    const workRoleField = new SingleLineInputModel();
    workRoleField.title = '工作岗位';
    workRoleField.size = 6;
    this.fields.push(workRoleField);
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
    return { ...super.getData(), fields: this.fields.map((each) => each.getData()) };
  }

  onRemoveField(field: FormComponentModel) {
    this.fields = this.fields.filter((each) => each !== field);
  }
}
