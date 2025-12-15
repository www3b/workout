<template>
  <div v-if="item.divider">
    <USeparator class="my-2" />
  </div>

  <div v-else class="navigation-item">
    <UButton
      :variant="isItemActive ? 'solid' : 'ghost'"
      :color="isItemActive ? 'primary' : 'neutral'"
      :disabled="item.disabled"
      size="sm"
      class="w-full justify-start"
      @click="$emit('click')"
    >
      <template v-if="item.icon" #leading>
        <UIcon :name="item.icon" class="w-4 h-4" />
      </template>

      <span class="flex-1 text-sm">{{ item.title }}</span>

      <template v-if="item.badge" #trailing>
        <UBadge
          :color="item.badgeColor || 'primary'"
          :label="typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge"
          size="xs"
        />
      </template>

      <template v-if="item.children && item.children.length > 0" #trailing>
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-90': isExpanded }"
        />
      </template>
    </UButton>

    <!-- Submenu -->
    <div
      v-if="item.children && isExpanded"
      class="ml-4 mt-1 space-y-1"
    >
      <NavigationMenuItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        @click="$emit('click', child)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '~/composables/useNavigationMenu'

interface Props {
  item: NavigationMenuItem
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 1
})

const emit = defineEmits<{
  click: [item?: NavigationMenuItem]
}>()

const route = useRoute()

// Check if item is active
const isItemActive = computed(() => {
  if (props.item.isActive !== undefined) return props.item.isActive

  if (props.item.to) {
    if (typeof props.item.to === 'string') {
      return route.path === props.item.to || route.path.startsWith(props.item.to + '/')
    }
    if (typeof props.item.to === 'object' && props.item.to.path) {
      return route.path === props.item.to.path || route.path.startsWith(props.item.to.path + '/')
    }
  }

  return false
})

// Check if submenu is expanded (you might want to manage this state in the parent)
const isExpanded = ref(false)

// Toggle expansion for items with children
const handleClick = () => {
  if (props.item.children?.length) {
    isExpanded.value = !isExpanded.value
  }
  emit('click', props.item)
}
</script>

<style scoped>
.navigation-item {
  @apply transition-colors duration-200;
}
</style>
