/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 返回在newVal中与oldVal不同的字段
 */
export function diff<T, K>(newVal: T, oldVal: K): { [key in keyof T]?: T[key] } {
  type Result = { [key in keyof T]?: T[key] };
  const result: Result = {};
  for (const key in newVal) {
    if (typeof newVal[key] !== typeof (oldVal as any)[key]) {
      result[key] = newVal[key];
    } else if (typeof newVal[key] === 'object') {
      if (JSON.stringify(newVal[key]) !== JSON.stringify((oldVal as any)[key])) {
        result[key] = newVal[key];
      }
    } else if (newVal[key] !== (oldVal as any)[key]) {
      result[key] = newVal[key];
    }
  }
  return result;
}
