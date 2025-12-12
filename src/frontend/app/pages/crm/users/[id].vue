<script setup lang="ts">
const route = useRoute();

definePageMeta({
    layout: 'crm',
});
</script>

<template>
    User {{ route.params.id }}
</template>

<style scoped>

</style>
