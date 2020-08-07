import { FormComponentDataBase, FormComponentModel } from './base';
import { components } from './components';
import { DescriptionModel } from './description/DescriptionModel';
import { MultiplyLineInputModel } from './multiplyLineInput/MultiplyLineInputModel';
import { MultiplySelectModel } from './multiplySelect/MultiplySelectModel';
import { SingleLineInputModel } from './singleLineInput/SingleLineInputModel';
import { SingleSelectModel } from './singleSelect/SingleSelectModel';
import { TableModel } from './table/TableModel';

export class ComponentFactory {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static create(data: FormComponentDataBase): FormComponentModel {
    // return new FormComponentModel();
    const type = data.type;
    // const constructor = components.find((each) => each.name === type);
    // if (!constructor) {
    //   throw new Error(`未注册的组件类型[${type}]`);
    // }
    // new constructor.model(data);
    switch (type) {
      case 'Description':
        return new DescriptionModel(data);
    }

    throw new Error('还未完工');
  }
}
