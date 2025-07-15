export default function isIndexInRangeOf<T>(
  array: T[],
  index: number
): boolean {
  return index > -1 && index < array.length;
}
