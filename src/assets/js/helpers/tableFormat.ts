import type { ITableData } from '@/types/homeTable';
import { dateFormat } from '@/assets/js/utils/dateTime';

export function getFormatedTable(data: ITableData[], currentPage: number = 1): ITableData[] {
  return data
    .map((item) => ({
      ...item,
      createdAt: dateFormat(item.createdAt),
    }))
    .slice((currentPage - 1) * 6, currentPage * 6);
}
