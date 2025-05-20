<script setup lang="ts">
interface ILoaderProps {
  color?: string;
  size?: number;
}

const { color = '#4a90e2', size = 40 } = defineProps<ILoaderProps>();
</script>

<template>
  <div
    class="spinner"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      borderTopColor: color,
    }"
  ></div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
