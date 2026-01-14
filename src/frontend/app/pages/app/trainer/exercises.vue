<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "app",
});
</script>

<template>
  <UPage>
    <UPageHeader class="px-8" title="Упражнения">
      <div class="pt-8">
        <UButton trailing-icon="i-heroicons-plus-circle">Добавить</UButton>
      </div>
    </UPageHeader>
    <UPageBody>
      <UPageGrid
        class="px-8"
        :cols="{ default: 1, sm: 2, md: 3, lg: 4 }"
        gap="6"
      >
        <UPageCard> Exercise 1 </UPageCard>
        <UPageCard> Exercise 2 </UPageCard>
        <UPageCard> Exercise 3 </UPageCard>
        <UPageCard> Exercise 4 </UPageCard>
        <UPageCard> Exercise 5 </UPageCard>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
