<template>
  <div class="navigation-item">
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

      <span class="flex-1 text-sm">{{ item.label }}</span>

      <template v-if="item.badge" #trailing>
        <UBadge
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
        :key="child.value || child.label"
        :item="child"
        :level="level + 1"
        @click="$emit('click', child)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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
  if ((props.item as any).active !== undefined) return Boolean((props.item as any).active)

  const to = (props.item as any).to
  if (to) {
    if (typeof to === 'string') {
      return route.path === to || route.path.startsWith(to + '/')
    }
    if (typeof to === 'object' && to.path) {
      return route.path === to.path || route.path.startsWith(to.path + '/')
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
