export type FormComponentType =
  | 'Description'
  | 'SingleLineInput'
  | 'NumberInput'
  | 'MultiplyLineInput'
  | 'SingleSelect'
  | 'MultiplySelect'
  | 'Table';

export const formComponents: Array<{
  type: FormComponentType;
  text: string;
  enabledInTable: boolean;
}> = [
  {
    type: 'Description',
    text: '描述文字',
    enabledInTable: false,
  },
  {
    type: 'SingleLineInput',
    text: '单行文字',
    enabledInTable: true,
  },
  {
    type: 'NumberInput',
    text: '数字',
    enabledInTable: true,
  },
  {
    type: 'MultiplyLineInput',
    text: '多行文字',
    enabledInTable: true,
  },
  {
    type: 'SingleSelect',
    text: '单项选择',
    enabledInTable: true,
  },
  {
    type: 'MultiplySelect',
    text: '多项选择',
    enabledInTable: true,
  },
  { type: 'Table', text: '表格', enabledInTable: false },
];
