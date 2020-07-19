import { FormComponentModel } from '../base';
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
    this.fields.push(nameField);

    const sexField = new SingleSelectModel();
    sexField.title = '性别';
    sexField.options = ['男', '女'];
    sexField.direction = 'horizontal';
    this.fields.push(sexField);

    const relationshipField = new SingleLineInputModel();
    relationshipField.title = '关系';
    this.fields.push(relationshipField);

    const ageField = new SingleLineInputModel();
    ageField.title = '年龄';
    this.fields.push(ageField);

    const workLocationField = new SingleLineInputModel();
    workLocationField.title = '工作地点';
    this.fields.push(workLocationField);

    const workRoleField = new SingleLineInputModel();
    workRoleField.title = '工作岗位';
    this.fields.push(workRoleField);
  }

  getData() {
    return { ...super.getData(), fields: this.fields.map((each) => each.getData()) };
  }
}
