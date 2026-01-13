<script setup lang="ts">
type Props = {
  open: boolean;
};

defineProps<Props>();

const name = ref("");
const email = ref("");
</script>

<template>
  <SimpleModal :is-open="open" title="User Details">
    <slot />
    <template #body>
      <UFormField label="Name" required>
        <UInput label="Name" v-model="name" class="mb-4" />
      </UFormField>
      <UFormField label="Email" required>
        <UInput label="Email" v-model="email" class="mb-4" />
      </UFormField>
    </template>
  </SimpleModal>
</template>
