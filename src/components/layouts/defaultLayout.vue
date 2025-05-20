<template>
  <main class="layout">
    <Transition name="fade">
      <MainHeader key="main-header" />
    </Transition>
    <div class="layout__wrapper">
      <slot></slot>
      <Transition name="slide-slow">
        <MainAside key="main-aside" />
      </Transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import MainAside from './components/MainAside.vue';
import MainHeader from './components/MainHeader.vue';
</script>

<style lang="scss" scoped>
.layout {
  height: 100dvh;
  background-color: $bg-color;
  overflow: auto;
  padding: 2rem 4rem;

  &__wrapper {
    display: flex;
    gap: 2rem;
  }
}
</style>
