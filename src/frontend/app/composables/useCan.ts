export const useCan = () => {
  const auth = useAuthStore();
  return {
    can: (p: string) => auth.can(p),
    hasRole: (r: string) => auth.hasRole(r),
  };
};
