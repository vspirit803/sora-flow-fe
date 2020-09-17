import { min } from 'vee-validate/dist/rules';

//最大公约数
export function gcd(a: number, b: number): number {
  let minNum = Math.min(a, b);
  let maxNum = Math.max(a, b);
  if (minNum === 0) {
    return maxNum;
  }

  while (minNum) {
    maxNum = maxNum % minNum;
    [minNum, maxNum] = [maxNum, minNum];
  }
  return maxNum;
}

//最小公倍数
export function lcm(a: number, b: number): number {
  const minNum = Math.min(a, b);
  const maxNum = Math.max(a, b);
  if (minNum === 0) {
    return maxNum;
  }
  return (minNum * maxNum) / gcd(minNum, maxNum);
}

//求一个数组的最小公倍数
export function lcms(arr: Array<number>): number {
  let result = 1;
  for (const each of arr.filter((each) => each)) {
    result = lcm(result, each);
  }
  return result;
}
