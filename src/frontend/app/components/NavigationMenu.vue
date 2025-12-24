<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

interface Props {
  config?: {
    showIcons?: boolean
    showBadges?: boolean
    collapsible?: boolean
    expandOnHover?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    showIcons: true,
    showBadges: true,
    collapsible: true,
    expandOnHover: false
  })
})

const config = reactive(props.config)

// Example menu items - in a real app, these would come from props, API, or store
const menuItems: NavigationMenuItem[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard'
  },
  {
    value: 'crm',
    label: 'CRM',
    icon: 'i-heroicons-users',
    to: '/crm',
    children: [
      {
        value: 'customers',
        label: 'Customers',
        icon: 'i-heroicons-user-group',
        to: '/crm/customers'
      },
      {
        value: 'leads',
        label: 'Leads',
        icon: 'i-heroicons-clipboard-document-list',
        to: '/crm/leads',
        badge: 5
      }
    ]
  },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: 'i-heroicons-chart-bar',
    to: '/analytics'
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    children: [
      {
        value: 'profile',
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/settings/profile'
      },
      {
        value: 'security',
        label: 'Security',
        icon: 'i-heroicons-shield-check',
        to: '/settings/security'
      }
    ]
  }
]

const navigation = useNavigationMenu({
  items: menuItems,
  activeItemClass: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
  inactiveItemClass: 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
  disabledItemClass: 'opacity-50 cursor-not-allowed',
  expandOnHover: config.expandOnHover,
  collapsible: config.collapsible,
  defaultExpanded: false,
  showIcons: config.showIcons,
  showBadges: config.showBadges,
  closeOnSelect: false
})

// Expose navigation methods for parent components
defineExpose({
  navigation
})
</script>

<template>
  <UNavigationMenu
    :items="navigation.items"
    :class="{ 'navigation-collapsed': navigation.isCollapsed }"
  >
    <template #item="{ item }">
      <UButton
        :variant="navigation.isItemActive(item) ? 'solid' : 'ghost'"
        :color="navigation.isItemActive(item) ? 'primary' : 'gray'"
        :disabled="item.disabled"
        :class="navigation.getItemClasses(item)"
        class="w-full justify-start"
        @click="navigation.handleItemClick(item)"
      >
        <template v-if="item.icon && config.showIcons" #leading>
          <UIcon :name="item.icon" class="w-5 h-5"/>
        </template>

        <span class="flex-1">{{ item.label }}</span>

        <template v-if="item.badge && config.showBadges" #trailing>
          <UBadge
            :label="typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge"
            size="xs"
          />
        </template>

        <template v-if="item.children && item.children.length > 0" #trailing>
          <UIcon
            :name="navigation.isItemExpanded(item.value) ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-90': navigation.isItemExpanded(item.value) }"
          />
        </template>
      </UButton>
    </template>

    <template #submenu="{ item, level }">
      <div
        v-if="item.children && navigation.isItemExpanded(item.value)"
        class="ml-4 mt-1 space-y-1"
        :class="{ 'ml-8': level > 1 }"
      >
        <NavigationMenuItem
          v-for="child in item.children"
          :key="child.value"
          :item="child"
          :level="level + 1"
          @click="navigation.handleItemClick(child)"
        />
      </div>
    </template>

    <template #divider>
      <USeparator class="my-2"/>
    </template>
  </UNavigationMenu>
</template>

<style scoped>
.navigation-collapsed {
  /* Styles for collapsed state */
}
</style>
