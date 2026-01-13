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
  } catch (e) {
    console.log('Failed to fetch auth data:', e);
    // если не авторизован — Laravel вернёт 401
    auth.clearAuth();
  }
});
