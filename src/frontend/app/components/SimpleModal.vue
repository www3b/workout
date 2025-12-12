<script setup lang="ts">
type Props = {
  isOpen: boolean,
  title: string,
}

defineProps<Props>();
</script>

<template>
  <UModal title="Modal with title">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div class="h-48" />
    </template>
  </UModal>
</template>

<style scoped>

</style>
