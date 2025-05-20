<template>
  <div class="filter">
    <div v-for="(field, index) in filterFields" :key="`${index}_filter`" class="filter__field">
      <label class="filter__label" :for="field.name">{{
        nameComparison[field.name as keyof typeof nameComparison]
      }}</label>
      <input
        class="filter__input"
        :id="field.name"
        type="text"
        :value="field.value"
        @input="updateValue(index, ($event.target as HTMLInputElement).value)"
        @keydown.enter="onSubmitButtonClick"
      />
    </div>
    <VButton class="filter__button" @click="onSubmitButtonClick">Поиск</VButton>
    <VButton class="filter__button" @click="onClearButtonClick">Очистить</VButton>
  </div>
</template>

<script setup lang="ts">
import VButton from '@/components/ui/VButton.vue';

// Types
import type { IFilterField } from '@/types/filter';

// Const
import { nameComparison } from '@/assets/js/constants/homeTable.ts';

const props = defineProps<{ filterFields: IFilterField[] }>();
const emit = defineEmits(['onSubmit', 'onClear', 'update:filterFields']);

function updateValue(index: number, value: string) {
  const newFields = [...props.filterFields];
  newFields[index].value = value;
  emit('update:filterFields', newFields);
}

function onSubmitButtonClick() {
  emit('onSubmit', props.filterFields);
}

function onClearButtonClick() {
  emit('onClear');
}
</script>

<style lang="scss" scoped>
.filter {
  height: 100%;

  &__label {
    margin-bottom: 0.4rem;
  }

  &__field {
    margin-bottom: 1rem;
  }

  &__input {
    border-radius: 0.6rem;
    border: 1px solid $gray;
    padding: 0.6rem 1rem;
    width: 100%;
  }

  &__button {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
