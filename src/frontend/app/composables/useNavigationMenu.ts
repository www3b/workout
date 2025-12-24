import type {RouteLocationRaw} from 'vue-router'
import type {NavigationMenuItem} from '@nuxt/ui'

type NavigationMenuItems = NavigationMenuItem[] | NavigationMenuItem[][]

export interface NavigationMenuConfig {
  items: NavigationMenuItems
  activeItemClass?: string
  inactiveItemClass?: string
  disabledItemClass?: string
  expandOnHover?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  showIcons?: boolean
  showBadges?: boolean
  closeOnSelect?: boolean
}

export const useNavigationMenu = (config: NavigationMenuConfig) => {
  const router = useRouter()
  const route = useRoute()

  const expandedItems = ref<Set<string>>(new Set())
  const activeItemId = ref<string>('')
  const isCollapsed = ref(config.defaultExpanded !== true)

  const isGrouped = (items: NavigationMenuItems): items is NavigationMenuItem[][] => {
    return Array.isArray(items[0])
  }

  const getItemKey = (item: NavigationMenuItem): string => {
    return item.value || item.label || ''
  }

  const flattenItems = (items: NavigationMenuItems): NavigationMenuItem[] => {
    return isGrouped(items) ? items.flat() : items
  }

  // Filter items based on permissions and visibility
  const filteredItems = computed(() => {
    return filterMenuItems(config.items)
  })

  // Get current active item based on route
  const currentActiveItem = computed(() => {
    return findActiveItem(flattenItems(filteredItems.value), route.path)
  })

  // Filter menu items recursively
  const filterMenuItems = (items: NavigationMenuItems): NavigationMenuItems => {
    if (isGrouped(items)) {
      return items.map(group => filterMenuItems(group) as NavigationMenuItem[])
    }

    return items
      .filter(item => {
        // Consumers can control visibility by filtering before passing items.
        return true
      })
      .map(item => {
        return {
          ...item,
          children: item.children ? (filterMenuItems(item.children as NavigationMenuItem[]) as NavigationMenuItem[]) : undefined
        }
      })
  }

  // Find active item based on current route
  const findActiveItem = (items: NavigationMenuItem[], currentPath: string): NavigationMenuItem | null => {
    for (const item of items) {
      // Check if item matches current route
      if ((item as any).to && routesMatch((item as any).to, currentPath)) {
        return item
      }

      // Check children recursively
      if (item.children) {
        const activeChild = findActiveItem(item.children as NavigationMenuItem[], currentPath)
        if (activeChild) {
          // Auto-expand parent if child is active
          if (item.value) expandedItems.value.add(getItemKey(item))
          return activeChild
        }
      }
    }
    return null
  }

  // Check if route matches menu item
  const routesMatch = (itemRoute: RouteLocationRaw, currentPath: string): boolean => {
    if (typeof itemRoute === 'string') {
      return itemRoute === currentPath || currentPath.startsWith(itemRoute + '/')
    }

    if (typeof itemRoute === 'object' && itemRoute.path) {
      return itemRoute.path === currentPath || currentPath.startsWith(itemRoute.path + '/')
    }

    return false
  }

  // Toggle item expansion
  const toggleExpanded = (itemId: string) => {
    if (expandedItems.value.has(itemId)) {
      expandedItems.value.delete(itemId)
    } else {
      expandedItems.value.add(itemId)
    }
  }

  // Expand all items
  const expandAll = () => {
    const allItemIds = getAllItemIds(flattenItems(filteredItems.value))
    expandedItems.value = new Set(allItemIds)
  }

  // Collapse all items
  const collapseAll = () => {
    expandedItems.value.clear()
  }

  // Get all item IDs recursively
  const getAllItemIds = (items: NavigationMenuItem[]): string[] => {
    let ids: string[] = []
    for (const item of items) {
      const key = getItemKey(item)
      if (key) ids.push(key)
      if (item.children) {
        ids = ids.concat(getAllItemIds(item.children as NavigationMenuItem[]))
      }
    }
    return ids
  }

  // Handle item click
  const handleItemClick = (item: NavigationMenuItem) => {
    if (item.disabled) return

    const anyItem = item as any

    if (typeof anyItem.onClick === 'function') {
      anyItem.onClick()
      return
    }

    if (anyItem.to) {
      router.push(anyItem.to as RouteLocationRaw)
    } else if (anyItem.href) {
      if (anyItem.external || anyItem.target === '_blank') {
        window.open(anyItem.href, anyItem.target || '_blank')
      } else {
        window.location.href = anyItem.href
      }
    }

    const itemKey = getItemKey(item)
    if (item.children?.length && itemKey) {
      toggleExpanded(itemKey)
    }

    if (config.closeOnSelect) {
      isCollapsed.value = true
    }
  }

  // Check if item is active
  const isItemActive = (item: NavigationMenuItem): boolean => {
    const anyItem = item as any
    if (anyItem.active !== undefined) return Boolean(anyItem.active)

    const active = currentActiveItem.value
    if (!active) return false

    return getItemKey(item) !== '' && getItemKey(item) === getItemKey(active) || isChildActive(item, active)
  }

  // Check if child is active
  const isChildActive = (parent: NavigationMenuItem, activeItem: NavigationMenuItem): boolean => {
    if (!parent.children) return false

    return (parent.children as NavigationMenuItem[]).some(child => {
      return (getItemKey(child) !== '' && getItemKey(child) === getItemKey(activeItem)) || isChildActive(child, activeItem)
    })
  }

  // Check if item is expanded
  const isItemExpanded = (itemId: string): boolean => {
    return expandedItems.value.has(itemId)
  }

  // Get CSS classes for menu item
  const getItemClasses = (item: NavigationMenuItem): Record<string, boolean> => {
    return {
      [config.activeItemClass || '']: isItemActive(item),
      [config.inactiveItemClass || '']: !isItemActive(item),
      [config.disabledItemClass || '']: item.disabled || false
    }
  }

  // Search menu items
  const searchItems = (query: string): NavigationMenuItem[] => {
    if (!query.trim()) return flattenItems(filteredItems.value)

    return searchMenuItems(flattenItems(filteredItems.value), query.toLowerCase())
  }

  // Search menu items recursively
  const searchMenuItems = (items: NavigationMenuItem[], query: string): NavigationMenuItem[] => {
    const results: NavigationMenuItem[] = []

    for (const item of items) {
      const labelMatch = item.label?.toLowerCase().includes(query) || false
      const descriptionMatch = (item as any).description?.toLowerCase().includes(query)
      const childrenMatch = item.children ? searchMenuItems(item.children as NavigationMenuItem[], query).length > 0 : false

      if (labelMatch || descriptionMatch || childrenMatch) {
        results.push({
          ...item,
          children: childrenMatch && item.children ? searchMenuItems(item.children as NavigationMenuItem[], query) : item.children
        })
      }
    }

    return results
  }

  // Get breadcrumb trail
  const getBreadcrumbTrail = (): NavigationMenuItem[] => {
    const active = currentActiveItem.value
    if (!active) return []

    return findBreadcrumbTrail(flattenItems(filteredItems.value), active)
  }

  // Find breadcrumb trail
  const findBreadcrumbTrail = (items: NavigationMenuItem[], target: NavigationMenuItem, trail: NavigationMenuItem[] = []): NavigationMenuItem[] => {
    for (const item of items) {

      if (getItemKey(item) !== '' && getItemKey(item) === getItemKey(target)) {
        return [...trail, item]
      }

      if (item.children) {
        const childTrail = findBreadcrumbTrail(item.children as NavigationMenuItem[], target, [...trail, item])
        if (childTrail.length > 0) {
          return childTrail
        }
      }
    }

    return []
  }

  // Watch route changes
  watch(() => route.path, () => {
    const active = findActiveItem(flattenItems(filteredItems.value), route.path)
    activeItemId.value = active ? getItemKey(active) : ''
  }, {immediate: true})

  return {
    items: filteredItems,
    activeItem: currentActiveItem,
    activeItemId: readonly(activeItemId),
    isCollapsed: readonly(isCollapsed),
    expandedItems: readonly(expandedItems),

    handleItemClick,
    toggleExpanded,
    expandAll,
    collapseAll,
    isItemActive,
    isItemExpanded,
    getItemClasses,
    searchItems,
    getBreadcrumbTrail,

    setCollapsed: (collapsed: boolean) => {
      isCollapsed.value = collapsed
    },
    setExpandedItems: (items: string[]) => {
      expandedItems.value = new Set(items)
    }
  }
}
