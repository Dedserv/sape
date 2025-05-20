<template>
  <component :is="tag" class="button" :class="classList" :disabled="disabled" :href="href">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const {
  href,
  color = 'primary',
  disabled,
} = defineProps<{ href?: string; color?: string; disabled?: boolean }>();

const tag = computed(() => (href ? 'a' : 'button'));

const classList = computed(() => ({
  [`button--${color}`]: Boolean(color),
  ['button--disabled']: disabled,
}));
</script>

<style lang="scss" scoped>
.button {
  cursor: pointer;
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  border: none;
  color: $white;
  font-size: 1.6rem;
  transition: background-color 0.3s ease-in-out;

  &--primary {
    background-color: $primary;

    &:not(.button--disabled):hover {
      background-color: $primary-dark;
    }
  }

  &--gray {
    background-color: $gray;

    &:not(.button--disabled):hover {
      background-color: $gray-dark;
    }
  }

  &--disabled {
    background-color: $gray;
    opacity: 0.9;
    cursor: not-allowed;
  }
}
</style>
