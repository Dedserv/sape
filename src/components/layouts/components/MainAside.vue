<template>
  <aside class="aside">
    <FilterAside
      :filter-fields="filterFields"
      @update:filter-fields="handleFilterUpdate"
      @onSubmit="submitEventHandler"
      @onClear="clearEventHandler"
    ></FilterAside>
  </aside>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import FilterAside from '@/components/common/filter/FilterAside.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

// Types
import type { IFilterField } from '@/types/filter';
import type { ITableData } from '@/types/homeTable';

// Utils
import { getDataFromApi } from '@/assets/js/utils/apiData';
import { objectToQuery } from '@/assets/js/utils/queryUtils';
import { convertObjectNameToValue } from '@/assets/js/utils/objectConvert';

// Store
import { useTableStore } from '@/stores/table';

// Const
import { DEFAULT_PARAMS } from '@/assets/js/constants/queryParams';

const route = useRoute();
const tableStore = useTableStore();

const filterFields = reactive<IFilterField[]>([
  {
    name: 'cat',
    value: '',
  },
  {
    name: 'city',
    value: '',
  },
  {
    name: 'name',
    value: '',
  },
]);

watchEffect(() => {
  const currentQuery = route.query;

  filterFields.forEach((filter) => {
    if (currentQuery[filter.name]) {
      filter.value = currentQuery[filter.name] as string;
    }
  });
});

function handleFilterUpdate(newFilterFields: IFilterField[]) {
  filterFields.splice(0, filterFields.length, ...newFilterFields);
}

async function submitEventHandler(data: IFilterField[]) {
  const actualQuery = { ...route.query, page: 1 };
  const objectKeyName = convertObjectNameToValue(data);
  const queryString = objectToQuery({ ...actualQuery, ...objectKeyName });

  const response = await getDataFromApi<ITableData>(queryString);
  tableStore.setTableData(response);
  tableStore.setTasksCount(response.length);
}

async function clearEventHandler() {
  await router.replace({
    query: DEFAULT_PARAMS,
  });

  tableStore.setLoadingStatus(true);
  tableStore.setTableData(tableStore.hashTableData);
  tableStore.setTasksCount(tableStore.defaultTasksCount);

  filterFields.forEach((filter) => (filter.value = ''));
}
</script>

<style lang="scss" scoped>
.aside {
  position: sticky;
  top: 0;
  right: 0;
  width: $width-aside;
  height: max-content;
  min-height: 20rem;
  border-radius: 1rem;
  padding: 1rem;
  background-color: $white;
  box-shadow: $shadow;
}
</style>
