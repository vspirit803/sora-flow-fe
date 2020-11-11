import { FormComponentModel, FormComponentModelDataBase, FormComponentValueDataBase } from './base';
import { DescriptionData, DescriptionModel } from './description';
import { MultiplyLineInputData, MultiplyLineInputModel } from './multiplyLineInput';
import { MultiplySelectData, MultiplySelectModel } from './multiplySelect';
import { NumberInputData, NumberInputModel } from './numberInput';
import { SingleLineInputData, SingleLineInputModel } from './singleLineInput';
import { SingleSelectData, SingleSelectModel } from './singleSelect';
import { TableData, TableModel } from './table';

export class ComponentFactory {
  static create(data: FormComponentModelDataBase, value?: FormComponentValueDataBase): FormComponentModel {
    const type = data.type;
    switch (type) {
      case 'Description':
        return new DescriptionModel(data as DescriptionData);
      case 'SingleLineInput':
        return new SingleLineInputModel(data as SingleLineInputData, value);
      case 'NumberInput':
        return new NumberInputModel(data as NumberInputData, value);
      case 'MultiplyLineInput':
        return new MultiplyLineInputModel(data as MultiplyLineInputData, value);
      case 'SingleSelect':
        return new SingleSelectModel(data as SingleSelectData, value);
      case 'MultiplySelect':
        return new MultiplySelectModel(data as MultiplySelectData, value);
      case 'Table':
        return new TableModel(data as TableData, value);
      default:
        throw new Error(`组件[${name}]未注册`);
    }
  }
}
