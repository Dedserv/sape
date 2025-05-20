<template>
  <div class="table">
    <div class="table__header" :class="{ 'table-dividers': dividers }">
      <div
        v-for="column in columns"
        :key="column.header"
        class="table__cell table__cell--header"
        :style="{ flex: column.widthFraction || 1 }"
      >
        <slot v-if="column.slotName" :name="`header-${column.slotName}`">
          {{ column.header }}
        </slot>

        <template v-else-if="column.isCheckbox">
          <input
            ref="checkAll"
            type="checkbox"
            :indeterminate="indeterminate"
            @change="toggleAll"
          />
        </template>

        <template v-else>
          {{ column.header }}
        </template>
      </div>
    </div>

    <div class="table__body">
      <div
        v-for="item in data"
        :key="item.id"
        class="table__row"
        :class="{ 'table-dividers': dividers }"
        @click="toggleSelection(item.id)"
      >
        <div
          v-for="column in columns"
          :key="column.header"
          class="table__cell"
          :style="{ flex: column.widthFraction || 1 }"
        >
          <slot
            v-if="column.slotName && $slots[`cell-${column.slotName}`]"
            :name="`cell-${column.slotName}`"
            :item="item"
          />

          <template v-else-if="column.isCheckbox">
            <input
              class="table__checkbox"
              type="checkbox"
              :checked="selectedRows.includes(item.id)"
              @change="toggleSelection(item.id)"
              @click.stop
            />
          </template>

          <template v-else>
            {{ column.field ? item[column.field as keyof ITableData] : '...' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Type
import type { ITableColumn, ITableData } from '@/types/homeTable';

interface Props<T> {
  data: T[];
  columns: ITableColumn[];
  selectedRows: Array<string | number>;
  dividers?: boolean;
}

const checkAll = ref<HTMLInputElement[]>([]);
const props = defineProps<Props<ITableData>>();
const emit = defineEmits(['changeSelectedItems']);

const indeterminate = computed(() => {
  return !props.selectedRows.length;
});

function toggleAll() {
  const isChecked = checkAll.value[0].checked;
  const allIds = props.data.map((item) => item.id);

  emit('changeSelectedItems', isChecked ? allIds : []);
}

function toggleSelection(id: string) {
  emit('changeSelectedItems', id);
}
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;

  &__header,
  &__row {
    display: flex;
    gap: 0.6rem;
    max-height: 9.6rem;

    &:not(:last-child):not(.table-dividers) {
      margin-top: 0.8rem;
    }
  }

  &__row {
    background-color: $white;
    transition: all 0.3s ease;

    &:hover {
      background-color: $gray-light;
    }
  }

  &__cell {
    padding: 0.5rem;
    min-width: 5rem;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    &--header {
      font-weight: 600;
    }
  }
}

.table-dividers {
  position: relative;
  padding: 1.4rem 4rem;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    width: 100%;
    background-color: $gray;
    opacity: 0.4;
  }
}
</style>
