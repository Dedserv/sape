// Store
import { useTableStore } from '@/stores/table';

// Types
import type { ITasksCount } from '@/types/homeTable';

// Utils
import router from '@/router';
import { queryToObject, objectToQuery } from '@/assets/js/utils/queryUtils.ts';

// Const
import { DEFAULT_PARAMS } from '@/assets/js/constants/queryParams';

export async function getDataFromApi<T>(params: string = '') {
  const tableStore = useTableStore();

  try {
    const defaultParams = objectToQuery(DEFAULT_PARAMS);
    const paramsQuery = params ? `${params}` : defaultParams;
    const queryUrl = queryToObject(paramsQuery);

    tableStore.setLoadingStatus(true);

    const res: Response = await fetch(
      `https://667d3095297972455f63f0d2.mockapi.io/api/tasks?${paramsQuery}`,
    );

    router.replace({
      query: { ...router.currentRoute.value.query, ...queryUrl },
    });

    if (res.status === 404) {
      return [];
    }

    const responseData: T[] = await res.json();

    return responseData;
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    tableStore.setLoadingStatus(false);
  }
}

export async function getTasksCount() {
  try {
    const res: Response = await fetch(
      'https://667d3095297972455f63f0d2.mockapi.io/api/backendData',
    );

    const responseData: ITasksCount[] = await res.json();

    return responseData[0].tasksCount;
  } catch (e) {
    console.error(e);
    return 1;
  }
}
