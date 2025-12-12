<script setup lang="ts">
definePageMeta({
    layout: 'crm',
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 w-full">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">CRM</h1>
                </div>


                <UCard class="mb-8">
                    <template #header>
                        <h2 class="text-xl font-semibold">User Profile</h2>
                    </template>
                    <div class="text-center py-8">
                        Content
                    </div>
                </UCard>

            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
