import { API_BASE_URL } from "./config";

let accessToken = null;
let isRefreshing = false;
let refreshSubscribers = [];

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

export const apiFetch = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;
    
    const makeRequest = (token) => {
        return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                ...(!isFormData && { "Content-Type": "application/json" }),
                ...(token && { "Authorization": `Bearer ${token}` }),
                ...options.headers,
            },
        });
    };

    let res = await makeRequest(accessToken);

    if (res.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/register')) {
        // If the access token is already being refreshed by another request,
        // we subscribe to wait for the new token instead of starting a new refresh request.
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    resolve(makeRequest(newToken));
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                setAccessToken(data.accessToken);
                isRefreshing = false;
                onTokenRefreshed(data.accessToken);
                
                // Retry the original request with the new token
                return makeRequest(data.accessToken);
            } else {
                isRefreshing = false;
                setAccessToken(null);
                window.location.href = "/login";
                return res;
            }
        } catch (err) {
            isRefreshing = false;
            setAccessToken(null);
            window.location.href = "/login";
            return res;
        }
    }

    return res;
};
