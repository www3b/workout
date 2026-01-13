<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "app",
});
</script>

<template>
    <UPage>
        <UPageGrid>
            <UPageCard>
                test
            </UPageCard>
        </UPageGrid>
    </UPage>
</template>
