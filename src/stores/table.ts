import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { ITableData } from '@/types/homeTable';

export const useTableStore = defineStore('table', () => {
  const hasSelectedRows = ref(false);
  const tableData = ref<ITableData[]>([]);
  const hashTableData = ref<ITableData[]>([]);
  const isLoading = ref(true);
  const tasksCount = ref(0);
  const defaultTasksCount = ref(0);

  function setHasSelectedRows(rows: boolean) {
    hasSelectedRows.value = rows;
  }

  function setTableData(data: ITableData[]) {
    tableData.value = data;
  }

  function setHashTableData(hashValues: ITableData[]) {
    hashTableData.value = hashValues;
  }

  function setLoadingStatus(condition: boolean) {
    isLoading.value = condition;
  }

  function setTasksCount(count: number) {
    tasksCount.value = count;
  }

  function setDefaultTasksCount(count: number) {
    defaultTasksCount.value = count;
  }

  return {
    hasSelectedRows,
    tableData,
    hashTableData,
    isLoading,
    tasksCount,
    defaultTasksCount,
    setHasSelectedRows,
    setTableData,
    setHashTableData,
    setLoadingStatus,
    setTasksCount,
    setDefaultTasksCount,
  };
});
