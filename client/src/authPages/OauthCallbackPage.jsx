import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setAccessToken } from '../utils/apiFetch.js';
import { API_BASE_URL } from '../utils/config';

export function OAuthCallbackPage({ onLoginSuccess }) {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            setAccessToken(token);


            // get user data
            fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    onLoginSuccess?.(data.data?.user);
                    navigate('/dashboard');
                });
        } else {
            navigate('/login');
        }
    }, []);

    return <div>Logging in...</div>;
}