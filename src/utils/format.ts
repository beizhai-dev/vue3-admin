/**
 * 格式化空值为指定字符串
 *
 * @param value 需要格式化的值
 * @param placeholder 占位符，默认为 '--'
 * @returns 格式化后的字符串
 */
export function formatEmpty<T>(value: T, placeholder = '--'): string {
  if (value === null || value === undefined || value === '') {
    return placeholder;
  }
  return String(value);
}
