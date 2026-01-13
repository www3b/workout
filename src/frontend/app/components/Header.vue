<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Dashboard',
        to: '/dashboard',
        active: route.path.startsWith('/docs/getting-started')
    },
    {
        label: 'CRM',
        to: '/crm',
        active: route.path.startsWith('/docs/components')
    },
])
</script>

<template>
    <UHeader to="/">
        <template #title>
            Workout
        </template>

        <UNavigationMenu :items="items" />

        <template #right>
            <UColorModeButton />

            <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
                <UButton
                    color="neutral"
                    variant="ghost"
                    to="https://github.com/nuxt/ui"
                    target="_blank"
                    icon="i-simple-icons-github"
                    aria-label="GitHub"
                />
            </UTooltip>
        </template>
    </UHeader>
</template>


<style scoped>

</style>
