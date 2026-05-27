let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};

export const apiFetch = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        const refreshRes = await fetch("http://localhost:5001/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            setAccessToken(data.accessToken);

            return fetch(url, {
                ...options,
                credentials: "include",
                headers: {
                    ...(!isFormData && { "Content-Type": "application/json" }),
                    "Authorization": `Bearer ${data.accessToken}`,
                    ...options.headers,
                },
            });
        }
        setAccessToken(null);
        window.location.href = "/login";
    }

    return res;
};
