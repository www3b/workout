<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import {useNavigationMenu} from "~/composables/useNavigationMenu";
import type { ExtendedNavigationMenuItem, NavigationMenuDivider } from '../composables/useNavigationMenu'

// Example menu items configuration
const exampleMenuItems: (ExtendedNavigationMenuItem | NavigationMenuDivider)[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        title: 'Dashboard',
        description: 'Main dashboard view',
        icon: 'i-heroicons-home',
        to: '/dashboard',
    },
    {
        id: 'crm',
        label: 'CRM',
        title: 'CRM',
        description: 'Customer relationship management',
        icon: 'i-heroicons-users',
        to: '/crm',
        children: [
            {
                id: 'customers',
                label: 'Customers',
                title: 'Customers',
                icon: 'i-heroicons-user-group',
                to: '/crm/customers',
                // permissions: ['view_customers']
            },
            {
                id: 'leads',
                label: 'Leads',
                title: 'Leads',
                icon: 'i-heroicons-clipboard-document-list',
                to: '/crm/leads',
                badge: 12,
                badgeColor: 'success',
                // permissions: ['view_leads']
            },
            {
                id: 'opportunities',
                label: 'Opportunities',
                title: 'Opportunities',
                icon: 'i-heroicons-currency-dollar',
                to: '/crm/opportunities',
                // permissions: ['view_opportunities']
            }
        ]
    },
    {
        id: 'users',
        label: 'Users',
        title: 'Users',
        description: 'Manage users',
        icon: 'i-heroicons-chart-bar',
        to: '/crm/users',
        // roles: ['admin', 'manager']
    },
    {
        id: 'settings',
        label: 'Settings',
        title: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        children: [
            {
                id: 'profile',
                label: 'Profile',
                title: 'Profile',
                icon: 'i-heroicons-user',
                to: '/settings/profile'
            },
            {
                id: 'security',
                label: 'Security',
                title: 'Security',
                icon: 'i-heroicons-shield-check',
                to: '/settings/security',
                permissions: ['manage_security']
            },
            {
                id: 'billing',
                label: 'Billing',
                title: 'Billing',
                icon: 'i-heroicons-credit-card',
                href: 'https://billing.example.com',
                external: true,
                target: '_blank'
            }
        ]
    },
    {
        id: 'help',
        label: 'Help & Support',
        title: 'Help & Support',
        icon: 'i-heroicons-question-mark-circle',
        href: 'https://support.example.com',
        external: true,
        target: '_blank'
    },
    {
        id: 'divider1',
        divider: true
    },
    {
        id: 'logout',
        label: 'Logout',
        title: 'Logout',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        onClick: () => {
            // Handle logout
            console.log('Logging out...')
        },
        disabled: false
    }
]

const navigationConfig = {
    items: exampleMenuItems,
    activeItemClass: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
    inactiveItemClass: 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
    disabledItemClass: 'opacity-50 cursor-not-allowed',
    expandOnHover: false,
    collapsible: true,
    defaultExpanded: false,
    showIcons: true,
    showBadges: true,
    closeOnSelect: false
}

const navigationMenu = useNavigationMenu(navigationConfig);

</script>

<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
            <template #header="{ collapsed }">
                <span v-if="!collapsed">Workout</span>
                <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto"/>
            </template>

            <template #default="{ collapsed }">
                <UButton
                    :label="collapsed ? undefined : 'Search...'"
                    icon="i-lucide-search"
                    color="neutral"
                    variant="outline"
                    block
                    :square="collapsed"
                >
                    <template v-if="!collapsed" #trailing>
                        <div class="flex items-center gap-0.5 ms-auto">
                            <UKbd value="meta" variant="subtle"/>
                            <UKbd value="K" variant="subtle"/>
                        </div>
                    </template>
                </UButton>

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="navigationMenu.uiItems.value"
                    orientation="vertical"
                />
            </template>

            <template #footer="{ collapsed }">
                <UButton
                    :avatar="{
          src: 'https://github.com/benjamincanac.png'
        }"
                    :label="collapsed ? undefined : 'Benjamin'"
                    color="neutral"
                    variant="ghost"
                    class="w-full"
                    :block="collapsed"
                />
            </template>
        </UDashboardSidebar>
        <slot/>
    </UDashboardGroup>
</template>

<style scoped>

</style>
