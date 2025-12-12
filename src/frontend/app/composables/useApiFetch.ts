type Response<T, K extends string> = {
    [key in K]: T;
}

export const useApiFetch = <T, K extends string>(url: string, options: any = {}) => {
    const config = useRuntimeConfig();

    const baseURL = import.meta.server ? config.apiBase : config.public.apiBase;

    return useFetch<Response<T, K>>(url, {
        ...options,
        baseURL,
        server: true,
        lazy: false,
        onRequest({request, options}) {
            const token = useCookie('auth_token');
            if (token.value) {
                options.headers = new Headers(options.headers);
                options.headers.set('Authorization', `Bearer ${token.value}`);
            }
        }
    });
};
