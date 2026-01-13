import { computed, ref } from "vue";
import { defineStore } from "pinia";

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthPayload = {
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);
  const loaded = ref(false);

  const permissionsSet = computed(() => new Set(permissions.value));
  const isAuthenticated = computed(() => !!user.value);

  const setAuth = (payload: AuthPayload) => {
    user.value = payload.user;
    roles.value = payload.roles ?? [];
    permissions.value = payload.permissions ?? [];
    loaded.value = true;
  };

  const clearAuth = () => {
    user.value = null;
    roles.value = [];
    permissions.value = [];
    loaded.value = true;
  };

  const can = (permission: string) => permissionsSet.value.has(permission);
  const hasRole = (role: string) => roles.value.includes(role);

  return {
    user,
    roles,
    permissions,
    loaded,
    permissionsSet,
    isAuthenticated,
    setAuth,
    clearAuth,
    can,
    hasRole,
  };
});
