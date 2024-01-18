export function lastSegment(str: string, split: string): string {
  return str.split(split).pop() ?? "";
}
export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
