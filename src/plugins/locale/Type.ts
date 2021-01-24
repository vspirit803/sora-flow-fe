import { zhCN as zhCNRaw } from './zh-CN';

const zhCN = Object.freeze(zhCNRaw);

type LocaleType = typeof zhCN;
export { LocaleType };

interface Messages {
  [key: string]: string | Messages;
}

type AddPrefix<Prefix, Keys> = `${Prefix & string}.${Keys & string}`;

type StringKeys<T extends Messages> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
type NestedKeys<T extends Messages> = { [K in keyof T]: T[K] extends Messages ? K : never }[keyof T];

type LeafPath<T extends Messages> = {
  [K in keyof T]: T[K] extends Messages ? AddPrefix<K, LeafPath<T[K]>> : T[K] extends string ? K : never;
}[keyof T];

type LeafPath2<T extends Messages> = {
  [K in keyof T]: T[K] extends string ? K : T[K] extends Messages ? AddPrefix<K, LeafPath<T[K]>> : never;
}[keyof T];

// type

type Test1 = StringKeys<typeof zhCN>;
type Test2 = NestedKeys<typeof zhCN>;
type path = LeafPath<typeof zhCN>;

type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
  : unknown;

type PickProperty<T, Expression> = Expression extends `${infer Prop}.${infer Rest}`
  ? Prop extends keyof T
    ? PickProperty<T[Prop], Rest>
    : unknown
  : Expression extends keyof T
  ? T[Expression]
  : unknown;

type Dot<T extends string> = T extends '' ? '' : '.';
type NestExpression<T extends any, Prefix extends string> = T extends { [key: string]: any }
  ? `${Prefix}.${Expression<T>}`
  : never;

type Expression<T extends { [key: string]: any }, Prefix extends string = ''> = {
  [P in keyof T]: P extends string
    ? T[P] extends string
      ? `${Prefix}${Dot<Prefix>}${P}`
      : never | NestExpression<T[P], `${Prefix}${Dot<Prefix>}${P}`>
    : never;
}[keyof T];

declare function t2<T extends Messages, K extends Expression<T>>(options: T, key: K): PickProperty<T, K>;

t2(zhCN, 'system.accounts.nickname');

type NotZeroDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Index = `${Digit}` | `${NotZeroDigit}${Digit}`; // Error

type GetIndexs<T extends string> = T extends `${infer P}{${infer M}}${infer Q}`
  ? (M extends Index ? M : never) | GetIndexs<Q>
  : never;
type GetKeys<T extends string> = T extends `${infer P}{${infer M}}${infer Q}`
  ? M extends Index
    ? never
    : M | GetKeys<Q>
  : never;

const test1 = '确认退出组织[{01}]吗？';
const test2 = '确认把[{0}]移出组织[{1}]吗？';
const test3 = '确认把[{name}]移出组织[{organization}]吗？';
type index = GetIndexs<typeof test2>;
type keys = GetKeys<typeof test3>;

type ContentProvider<T> = T extends string
  ? GetKeys<T> extends never
    ? never
    : { [key in GetKeys<T>]: string }
  : unknown;
type content = ContentProvider<typeof test3>;

declare function t3<T extends Messages, K extends Expression<T>>(
  options: T,
  key: K,
  content: ContentProvider<PropType<T, K>>,
): string;

type tFunSet<T extends Messages, K extends Expression<T>> = {
  [kk in K]: ContentProvider<PropType<T, kk>> extends never
    ? (key: kk) => string
    : (key: kk, content: ContentProvider<PropType<T, kk>>) => string;
};

declare function useI18<T extends Messages, K extends Expression<T>>(
  zhCN: T,
): {
  t: UnionToIntersection<{ [k in keyof tFunSet<T, K>]: tFunSet<T, K>[k] }[keyof tFunSet<T, K>]>;
};

t3(zhCN, 'system.test', { organization: 'a', name: '' });
// t3(zhCN, 'organization.confirmLeaveOrganization', {});
// t3(zhCN, 'organization.leaveOrganization');

const { t } = useI18(zhCN);
t('system.test', { organization: '', name: '' });
t('system.accounts.nickname');
t('organization.leaveOrganization');
t('confirm');
t('organization.confirmLeaveOrganization');
t('organization.leaveOrganization');
// t('system.test2')

type tttt = ContentProvider<PropType<typeof zhCN, 'system.accounts.nickname'>>;

const O = {
  a: (a: 'a') => 1,
  b: (b: 'b') => false,
  c: (c: 'c') => '',
} as const;

type typeO = typeof O;

type ttO = { [k in keyof typeO]: typeO[k] }[keyof typeO];

type fun = ((
  key: 'system.test',
  content: {
    organization: string;
    name: string;
  },
) => string) &
  ((key: 'system.accounts.nickname') => string) &
  ((key: 'login') => string) &
  ((key: 'language') => string) &
  ((key: 'username') => string) &
  ((key: 'password') => string) &
  ((key: 'logout') => string);
declare const f: UnionToIntersection<fun>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

f('system.test');
