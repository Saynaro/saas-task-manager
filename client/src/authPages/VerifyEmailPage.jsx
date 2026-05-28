import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { apiFetch } from '../utils/apiFetch';
import './Auth.css';

export function VerifyEmailPage({ refreshUser }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'prompt'
    const verificationStarted = useRef(false);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        
        if (token) {
            if (verificationStarted.current) return;
            verificationStarted.current = true;

            setStatus('loading');
            fetch(`http://localhost:5001/api/email/verify-email?token=${token}`)
                .then(res => res.json())
                .then(async (data) => {
                    if (data.success || data.message === "Email verified successfully") {
                        setStatus('success');
                        if (refreshUser) {
                            await refreshUser();
                        }
                        setTimeout(() => navigate('/dashboard'), 3000);
                    } else {
                        setStatus('error');
                    }
                })
                .catch(() => setStatus('error'));
            return;
        }

        setStatus('prompt');

        // Check verification status periodically
        const checkInterval = setInterval(async () => {
            try {
                const res = await apiFetch("http://localhost:5001/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.user?.isVerified) {
                        clearInterval(checkInterval);
                        setStatus('success');
                        if (refreshUser) {
                            await refreshUser();
                        }
                        setTimeout(() => navigate('/dashboard'), 3000);
                    }
                }
            } catch (err) {
                console.error("Error checking verification status:", err);
            }
        }, 3000);

        return () => clearInterval(checkInterval);
    }, [navigate, refreshUser]);

    return (
        <div className="auth-bg">
            <div className="auth-card">
                {status === 'loading' && (
                    <>
                        <div className="auth-logo spinner-container">
                            <div className="spinner"></div>
                        </div>
                        <h1 className="auth-title">Verifying email</h1>
                        <p className="auth-subtitle">Please wait while we verify your email address...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="auth-logo" style={{ background: '#10b981', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h1 className="auth-title">Email Verified!</h1>
                        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                            Your email has been verified successfully. Redirecting you to the home page...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="auth-logo" style={{ background: '#ef4444', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <h1 className="auth-title">Verification Failed</h1>
                        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                            The verification link is invalid or has expired.
                        </p>
                        <Link to="/login" className="auth-btn" style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                            Back to Login
                        </Link>
                    </>
                )}

                {status === 'prompt' && (
                    <>
                        <div className="auth-logo">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h1 className="auth-title">Check your email</h1>
                        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                            We have sent a verification link to your email. Please check your inbox and click the link to verify your account.
                        </p>
                        <Link to="/login" className="auth-btn" style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
            {status === 'loading' && (
                <style>{`
                    .spinner {
                        border: 3px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top: 3px solid #fff;
                        width: 20px;
                        height: 20px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            )}
        </div>
    );
}