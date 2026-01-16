<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import {useNavigationMenu} from "~/composables/useNavigationMenu";

// Example menu items configuration
const exampleMenuItems = [
  [
    {
      value: 'dashboard',
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard',
    },
    {
      value: 'crm',
      label: 'CRM',
      icon: 'i-heroicons-users',
      to: '/crm',
    },
    {
      value: 'users',
      label: 'Users',
      icon: 'i-heroicons-chart-bar',
      to: '/crm/users',
    },
    // {
    //   value: 'settings',
    //   label: 'Settings',
    //   icon: 'i-heroicons-cog-6-tooth',
    //   // children: [
    //   //   {
    //   //     label: 'Profile',
    //   //     description: 'Personal settings',
    //   //     icon: 'i-heroicons-user',
    //   //     to: '/settings/profile'
    //   //   },
    //   //   {
    //   //     label: 'Security',
    //   //     description: 'Security settings',
    //   //     icon: 'i-heroicons-shield-check',
    //   //     to: '/settings/security'
    //   //   },
    //   //   {
    //   //     label: 'Billing',
    //   //     description: 'Billing portal',
    //   //     icon: 'i-heroicons-credit-card',
    //   //     to: 'https://billing.example.com',
    //   //     target: '_blank'
    //   //   }
    //   // ]
    // },
  ],
  [
    {
      value: 'logout',
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: () => {
        console.log('Logging out...')
      }
    }
  ]
] satisfies NavigationMenuItem[][]

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
          :items="navigationMenu.items.value"
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
