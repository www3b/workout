import type {RouteLocationRaw} from 'vue-router'
import type {NavigationMenuItem} from '@nuxt/ui'

// Extended interface for our custom features
export interface ExtendedNavigationMenuItem {
  id: string
  label: string
  title: string // Keep for backward compatibility
  description?: string
  icon?: string
  badge?: string | number
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  to?: RouteLocationRaw
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  disabled?: boolean
  external?: boolean
  divider?: false
  onClick?: () => void
  isActive?: boolean
  isVisible?: boolean
  permissions?: string[]
  roles?: string[]
  children?: (ExtendedNavigationMenuItem | NavigationMenuDivider)[]
  value?: string
  type?: 'label' | 'trigger' | 'link'
  defaultOpen?: boolean
  open?: boolean
  slot?: string
  onSelect?: (e: Event) => void
  class?: any
  ui?: any
  tooltip?: any
  trailingIcon?: string
  avatar?: any
}

export interface NavigationMenuDivider {
  id: string
  divider: true
}

export interface NavigationMenuConfig {
  items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[]
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
  const {user} = useAuth()

  const expandedItems = ref<Set<string>>(new Set())
  const activeItemId = ref<string>('')
  const isCollapsed = ref(config.defaultExpanded !== true)

  // Filter items based on permissions and visibility
  const filteredItems = computed(() => {
    return filterMenuItems(config.items)
  })

  // Get current active item based on route
  const currentActiveItem = computed(() => {
    return findActiveItem(filteredItems.value, route.path)
  })

  // Check if user has required permissions for item
  const hasPermissions = (item: ExtendedNavigationMenuItem): boolean => {
    if (!item.permissions?.length && !item.roles?.length) return true

    const userPermissions = user.value?.permissions || []
    const userRoles = user.value?.roles || []

    const hasRequiredPermissions = !item.permissions?.length ||
      item.permissions.some(permission => userPermissions.includes(permission))

    const hasRequiredRoles = !item.roles?.length ||
      item.roles.some(role => userRoles.includes(role))

    return hasRequiredPermissions && hasRequiredRoles
  }

  // Filter menu items recursively
  const filterMenuItems = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[]): (ExtendedNavigationMenuItem | NavigationMenuDivider)[] => {
    return items
      .filter(item => {
        // Always include dividers
        if (item.divider) return true

        // Check visibility for menu items
        if (item.isVisible === false) return false
        // Check permissions for menu items
        if (!hasPermissions(item)) return false
        return true
      })
      .map(item => {
        // Handle dividers
        if (item.divider) return item

        // Handle menu items with children
        return {
          ...item,
          // Filter children recursively
          children: item.children ? filterMenuItems(item.children) : undefined
        }
      })
      .filter(item => {
        // Handle dividers
        if (item.divider) return true

        // Remove items with no visible children
        if (item.children?.length === 0) return false
        return true
      })
  }

  // Find active item based on current route
  const findActiveItem = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[], currentPath: string): ExtendedNavigationMenuItem | null => {
    for (const item of items) {
      // Skip dividers
      if (item.divider) continue

      // Check if item matches current route
      if (item.to && routesMatch(item.to, currentPath)) {
        return item
      }

      // Check children recursively
      if (item.children) {
        const activeChild = findActiveItem(item.children, currentPath)
        if (activeChild) {
          // Auto-expand parent if child is active
          expandedItems.value.add(item.id)
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
    const allItemIds = getAllItemIds(filteredItems.value)
    expandedItems.value = new Set(allItemIds)
  }

  // Collapse all items
  const collapseAll = () => {
    expandedItems.value.clear()
  }

  // Get all item IDs recursively
  const getAllItemIds = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[]): string[] => {
    let ids: string[] = []
    for (const item of items) {
      ids.push(item.id)
      if (!item.divider && item.children) {
        ids = ids.concat(getAllItemIds(item.children))
      }
    }
    return ids
  }

  // Handle item click
  const handleItemClick = (item: ExtendedNavigationMenuItem) => {
    if (item.disabled) return

    // Call custom onClick handler
    if (item.onClick) {
      item.onClick()
      return
    }

    // Handle navigation
    if (item.to) {
      router.push(item.to)
    } else if (item.href) {
      if (item.external || item.target === '_blank') {
        window.open(item.href, item.target || '_blank')
      } else {
        window.location.href = item.href
      }
    }

    // Toggle expansion if item has children
    if (item.children?.length) {
      toggleExpanded(item.id)
    }

    // Close menu on select if configured
    if (config.closeOnSelect) {
      isCollapsed.value = true
    }
  }

  // Check if item is active
  const isItemActive = (item: ExtendedNavigationMenuItem): boolean => {
    if (item.isActive !== undefined) return item.isActive

    const active = currentActiveItem.value
    if (!active) return false

    return item.id === active.id || isChildActive(item, active)
  }

  // Check if child is active
  const isChildActive = (parent: ExtendedNavigationMenuItem, activeItem: ExtendedNavigationMenuItem): boolean => {
    if (!parent.children) return false

    return parent.children.some(child => {
      if (child.divider) return false
      return child.id === activeItem.id || isChildActive(child, activeItem)
    })
  }

  // Check if item is expanded
  const isItemExpanded = (itemId: string): boolean => {
    return expandedItems.value.has(itemId)
  }

  // Get CSS classes for menu item
  const getItemClasses = (item: ExtendedNavigationMenuItem): Record<string, boolean> => {
    return {
      [config.activeItemClass || '']: isItemActive(item),
      [config.inactiveItemClass || '']: !isItemActive(item),
      [config.disabledItemClass || '']: item.disabled || false
    }
  }

  // Search menu items
  const searchItems = (query: string): (ExtendedNavigationMenuItem | NavigationMenuDivider)[] => {
    if (!query.trim()) return filteredItems.value

    return searchMenuItems(filteredItems.value, query.toLowerCase())
  }

  // Search menu items recursively
  const searchMenuItems = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[], query: string): (ExtendedNavigationMenuItem | NavigationMenuDivider)[] => {
    const results: (ExtendedNavigationMenuItem | NavigationMenuDivider)[] = []

    for (const item of items) {
      // Always include dividers if there are matching items around them
      if (item.divider) {
        results.push(item)
        continue
      }

      const titleMatch = item.title.toLowerCase().includes(query)
      const descriptionMatch = item.description?.toLowerCase().includes(query)
      const childrenMatch = item.children ? searchMenuItems(item.children, query).length > 0 : false

      if (titleMatch || descriptionMatch || childrenMatch) {
        results.push({
          ...item,
          children: childrenMatch && item.children ? searchMenuItems(item.children, query) : item.children
        })
      }
    }

    return results
  }


  const getBreadcrumbTrail = (): ExtendedNavigationMenuItem[] => {
    const active = currentActiveItem.value
    if (!active) return []

    return findBreadcrumbTrail(filteredItems.value, active)
  }


  const findBreadcrumbTrail = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[], target: ExtendedNavigationMenuItem, trail: ExtendedNavigationMenuItem[] = []): ExtendedNavigationMenuItem[] => {
    for (const item of items) {

      if (item.divider) continue

      if (item.id === target.id) {
        return [...trail, item]
      }

      if (item.children) {
        const childTrail = findBreadcrumbTrail(item.children, target, [...trail, item])
        if (childTrail.length > 0) {
          return childTrail
        }
      }
    }

    return []
  }


  watch(() => route.path, () => {
    const active = findActiveItem(filteredItems.value, route.path)
    activeItemId.value = active?.id || ''
  }, {immediate: true})


  const toUINavigationItems = (items: (ExtendedNavigationMenuItem | NavigationMenuDivider)[]): NavigationMenuItem[] => {
    return items

      .map(item => {
        const menuItem = item as ExtendedNavigationMenuItem
        const uiItem: NavigationMenuItem = {
          icon: menuItem.icon,
          badge: menuItem.badge,
          disabled: menuItem.disabled,
          value: menuItem.id,
          to: menuItem.to,
          href: menuItem.href,
          target: menuItem.target,
          external: menuItem.external,
          onClick: menuItem.onClick,
          children: menuItem.children ? toUINavigationItems(menuItem.children) : undefined,
          type: menuItem.type || 'link',
          defaultOpen: menuItem.defaultOpen,
          open: menuItem.open,
          slot: menuItem.slot,
          onSelect: menuItem.onSelect,
          class: menuItem.class,
          ui: menuItem.ui,
          tooltip: menuItem.tooltip,
          trailingIcon: menuItem.trailingIcon,
          avatar: menuItem.avatar
        }

        return uiItem
      })
  }

  return {
    items: filteredItems,
    uiItems: computed(() => toUINavigationItems(filteredItems.value)),
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
    hasPermissions,

    setCollapsed: (collapsed: boolean) => {
      isCollapsed.value = collapsed
    },
    setExpandedItems: (items: string[]) => {
      expandedItems.value = new Set(items)
    }
  }
}
