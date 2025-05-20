<script setup lang="ts">
// Imports
// Vue
import { computed, onBeforeMount, ref, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

// Components
import CommonToolbar from '@/components/common/CommonToolbar.vue';
import GridTable from '@/components/common/table/GridTable.vue';
import VLoader from '@/components/ui/VLoader.vue';
import PagePagination from '@/components/common/PagePagination.vue';

// Type
import type { ITableColumn, ITableData } from '@/types/homeTable';

// Store
import { useTableStore } from '@/stores/table';

// Helpers
import { getFormatedTable } from '@/assets/js/helpers/tableFormat';

// Utils
import { getDataFromApi, getTasksCount } from '@/assets/js/utils/apiData';

// Const
import { nameComparison } from '@/assets/js/constants/homeTable.ts';
import { objectToQuery } from '@/assets/js/utils/queryUtils';
import { LIMIT_PARAM } from '@/assets/js/constants/queryParams';
// End imports

// Type region
type CheckedItems = string | string[];
// End Type region

// Const region
const customColumn = [
  {
    header: 'id',
    widthFraction: 0.2,
    field: 'id',
  },
  {
    header: 'loremText',
    widthFraction: 2,
    field: 'loremText',
    slotName: 'loremText',
  },
  {
    header: 'avatar',
    widthFraction: 0.3,
    field: 'avatar',
    slotName: 'avatar',
  },
];

const firstCheckboxC: ITableColumn = { isCheckbox: true, widthFraction: 0.2 };
// End Const region

// Data region
const tableData = ref<ITableData[]>([]);
const columnsTable = ref<ITableColumn[]>([]);
const selectedIds = ref<string[]>([]);

const tableStore = useTableStore();
const route = useRoute();
// End Data region

const tableHeaders = computed<Array<keyof ITableData>>(() => {
  if (tableData.value.length === 0) {
    return [];
  }

  return Object.keys(tableData.value[0]) as Array<keyof ITableData>;
});

const isLoading = computed<boolean>(() => tableStore.isLoading);
const tasksCount = computed<number>(() => tableStore.tasksCount);
const pagesCount = computed<number>(() => Math.ceil(tasksCount.value / LIMIT_PARAM));
const currentPage = computed<number>(() => Number(route.query?.page) || 1);

watch(
  () => tableStore.tableData,
  (newData) => {
    const formatedTable = newData.length ? getFormatedTable(newData, currentPage.value) : [];

    tableData.value = formatedTable;

    nextTick(() => {
      tableStore.setLoadingStatus(false);
    });
  },
);

onBeforeMount(async () => {
  const mountedQuery = objectToQuery(route.query);

  const [tasksCountRes, taskDataRes] = await Promise.all([
    getTasksCount(),
    getDataFromApi<ITableData>(mountedQuery),
  ]);

  tableStore.setTasksCount(taskDataRes.length);
  tableStore.setDefaultTasksCount(tasksCountRes);

  tableData.value = taskDataRes;

  tableData.value = getFormatedTable(tableData.value, currentPage.value);

  tableStore.setHashTableData(tableData.value);

  const columns = tableHeaders.value.reverse().map((header) => {
    const defaultColumn = { header: nameComparison[header], field: header, widthFraction: 1 };

    const findCurrentColumn = customColumn.find((item) => item.header === header);

    const currentColumn = findCurrentColumn
      ? { ...findCurrentColumn, header: nameComparison[header] }
      : defaultColumn;

    return currentColumn;
  });

  columnsTable.value.push(firstCheckboxC, ...columns);
});

function changeSelectedItemsHandler(data: CheckedItems) {
  if (Array.isArray(data)) {
    selectedIds.value = data;
  } else {
    const hasSelectedItem = selectedIds.value.includes(data);

    if (hasSelectedItem) {
      selectedIds.value = selectedIds.value.filter((id) => id !== data);
      tableStore.setHasSelectedRows(selectedIds.value.length > 0);
      return;
    }

    selectedIds.value = [...selectedIds.value, data];
  }

  tableStore.setHasSelectedRows(selectedIds.value.length > 0);
}

async function onChangePageHandler(page: number) {
  await router.replace({
    query: { ...route.query, page: page },
  });

  const actualQuery: string = objectToQuery(route.query);

  tableData.value = await getDataFromApi<ITableData>(actualQuery);
  tableData.value = getFormatedTable(tableData.value, currentPage.value);
}
</script>

<template>
  <Transition name="fade-slow" mode="out-in">
    <div v-if="!isLoading" class="home">
      <section class="home__content">
        <h2 class="home__content-title">Кошки на сегодня</h2>
        <Transition name="fade">
          <GridTable
            v-if="tableData.length"
            v-model:selectedIds="selectedIds"
            :data="tableData"
            :columns="columnsTable"
            :selected-rows="selectedIds"
            @changeSelectedItems="changeSelectedItemsHandler"
            dividers
          >
            <template #cell-avatar="{ item }">
              <img class="home__table-img" :src="item.avatar" />
            </template>
          </GridTable>
          <div v-else>Ничего не найдено</div>
        </Transition>
      </section>

      <CommonToolbar v-if="tableData.length" :tasksCount="tasksCount" class="home__toolbar">
        <template #pagination>
          <PagePagination
            class="home__pagination"
            :pagesCount="pagesCount"
            @changePage="onChangePageHandler"
          />
        </template>
      </CommonToolbar>
    </div>

    <div class="home home__loader" v-else>
      <VLoader :size="80" />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100%;
  width: 100%;

  &__content {
    background-color: $white;
    border-radius: 1rem;
    box-shadow: $shadow;
    padding: 2rem 0;
  }

  &__content-title {
    margin-bottom: 2rem;
    padding: 0 4rem;
  }

  &__table-img {
    width: 100%;
    border-radius: 50%;
  }

  &__toolbar {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  &__pagination {
    margin: 0 4rem 0 3rem;
  }

  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
