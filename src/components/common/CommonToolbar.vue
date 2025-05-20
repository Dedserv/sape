<template>
  <div class="toolbar">
    <slot name="pagination"></slot>
    <VButton :disabled="!tableStore.hasSelectedRows">Отправить</VButton>
  </div>
</template>

<script setup lang="ts">
import VButton from '@/components/ui/VButton.vue';

// Store
import { useTableStore } from '@/stores/table';

const tableStore = useTableStore();
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-top: 1.2rem;
  background-color: $white;
  border-radius: 1rem;
  box-shadow: $shadow;
  padding: 1rem;
}
</style>
