import type { IFilterField } from '@/types/filter.ts';

export function convertObjectNameToValue(object: IFilterField[]): Record<string, string> {
  return object.reduce((acc: { [key: string]: string }, item: IFilterField) => {
    acc[item.name] = item.value;
    return acc;
  }, {});
}
