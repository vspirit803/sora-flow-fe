import { FormComponentDataBase, FormComponentModel } from './base';
import { DescriptionData, DescriptionModel } from './description';
import { MultiplyLineInputData, MultiplyLineInputModel } from './multiplyLineInput';
import { MultiplySelectData, MultiplySelectModel } from './multiplySelect';
import { SingleLineInputData, SingleLineInputModel } from './singleLineInput';
import { SingleSelectData, SingleSelectModel } from './singleSelect';
import { TableData, TableModel } from './table';

export class ComponentFactory {
  static create(data: FormComponentDataBase): FormComponentModel {
    const type = data.type;
    switch (type) {
      case 'Description':
        return new DescriptionModel(data as DescriptionData);
      case 'SingleLineInput':
        return new SingleLineInputModel(data as SingleLineInputData);
      case 'MultiplyLineInput':
        return new MultiplyLineInputModel(data as MultiplyLineInputData);
      case 'SingleSelect':
        return new SingleSelectModel(data as SingleSelectData);
      case 'MultiplySelect':
        return new MultiplySelectModel(data as MultiplySelectData);
      case 'Table':
        return new TableModel(data as TableData);
      default:
        throw new Error(`组件[${name}]未注册`);
    }
  }
}
