export default defineNuxtPlugin(async () => {
  const { $api } = useNuxtApp();
  const auth = useAuthStore();
  if (auth.loaded) return;

  const config = useRuntimeConfig();

  try {
    const headers = useRequestHeaders(["cookie"]);
    // console.log('Request headers:', headers);
    const data = await $api(`/auth/me`, {
      headers,
      credentials: "include",
    });
    // console.log('Fetched auth data:', data);
    auth.setAuth(data as any);
  } catch (e: any) {
    if (e?.status === 401 || e?.statusCode === 401) {
      // Not authenticated; keep auth cleared without noisy logs.
      auth.clearAuth();
      return;
    }

    console.log('Failed to fetch auth data:', e);
    auth.clearAuth();
  }
});
