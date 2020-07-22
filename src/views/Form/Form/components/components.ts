import { FormComponentModel } from './base/FormComponentModel';
import { DescriptionModel } from './description/DescriptionModel';
import { MultiplyLineInputModel } from './multiplyLineInput/MultiplyLineInputModel';
import { MultiplySelectModel } from './multiplySelect/MultiplySelectModel';
import { SingleLineInputModel } from './singleLineInput/SingleLineInputModel';
import { SingleSelectModel } from './singleSelect/SingleSelectModel';
import { TableModel } from './table/TableModel';

export const components: Array<{
  name: string;
  text: string;
  enabledInTable: boolean;
  model: typeof FormComponentModel;
}> = [
  { name: 'Description', text: '描述文字', enabledInTable: false, model: DescriptionModel },
  { name: 'SingleLineInput', text: '单行文字', enabledInTable: true, model: SingleLineInputModel },
  { name: 'MultiplyLineInput', text: '多行文字', enabledInTable: true, model: MultiplyLineInputModel },
  { name: 'SingleSelect', text: '单项选择', enabledInTable: true, model: SingleSelectModel },
  { name: 'MultiplySelect', text: '多项选择', enabledInTable: true, model: MultiplySelectModel },
  { name: 'Table', text: '表格', enabledInTable: false, model: TableModel },
];
