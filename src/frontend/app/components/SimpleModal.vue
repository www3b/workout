<script setup lang="ts">
type Props = {
  isOpen: boolean;
  title: string;
};

defineProps<Props>();
</script>

<template>
  <UModal :title="title" :is-open="isOpen">
    <slot />

    <template #body>
      <slot name="body" />
    </template>
  </UModal>
</template>

<style scoped></style>
