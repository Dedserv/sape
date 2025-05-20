<template>
  <ul class="pagination">
    <template v-if="pagesCount <= 5">
      <li v-for="page in pagesCount" :key="`page_${page}`">
        <VButton :color="activePageColor(page)" @click="onChangePageClick(page)">
          {{ page }}
        </VButton>
      </li>
    </template>
    <template v-else>
      <li>
        <VButton :color="activePageColor(1)" @click="onChangePageClick(1)"> 1 </VButton>
      </li>

      <li v-if="showLeftEllipsis">
        <VButton disabled>...</VButton>
      </li>

      <li v-for="page in middlePages" :key="`page_${page}`">
        <VButton :color="activePageColor(page)" @click="onChangePageClick(page)">
          {{ page }}
        </VButton>
      </li>

      <li v-if="showRightEllipsis">
        <VButton disabled>...</VButton>
      </li>

      <li>
        <VButton :color="activePageColor(pagesCount)" @click="onChangePageClick(pagesCount)">
          {{ pagesCount }}
        </VButton>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import VButton from '@/components/ui/VButton.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const SIBLINGS_COUNT = 1;

const props = defineProps<{ pagesCount: number }>();
const emit = defineEmits(['changePage']);
const route = useRoute();

const currentPage = computed<number>(() => {
  const page = Number(route.query.page);
  return page > 0 ? page : 1;
});

const middlePages = computed(() => {
  if (props.pagesCount <= 5) {
    return [];
  }

  let startPage = Math.max(2, currentPage.value - SIBLINGS_COUNT);
  let endPage = Math.min(props.pagesCount - 1, currentPage.value + SIBLINGS_COUNT);

  const pagesShown = endPage - startPage + 1;
  if (pagesShown < 3) {
    if (startPage === 2) {
      endPage = Math.min(props.pagesCount - 1, startPage + 2);
    } else if (endPage === props.pagesCount - 1) {
      startPage = Math.max(2, endPage - 2);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

const showLeftEllipsis = computed(() => {
  if (props.pagesCount <= 5) return false;
  return middlePages.value.length > 0 && middlePages.value[0] > 2;
});

const showRightEllipsis = computed(() => {
  if (props.pagesCount <= 5) return false;
  return (
    middlePages.value.length > 0 &&
    middlePages.value[middlePages.value.length - 1] < props.pagesCount - 1
  );
});

const activePageColor = (pageNumber: number): string =>
  currentPage.value === pageNumber ? 'primary' : 'gray';

function onChangePageClick(pageNumber: number) {
  emit('changePage', pageNumber);
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  gap: 0.6rem;
}
</style>
