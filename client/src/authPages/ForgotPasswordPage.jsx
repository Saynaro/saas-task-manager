import { useState } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import './Auth.css';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/email/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Reset link sent!");
            } else {
                toast.error(data.error || "Failed to send reset link");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card">
        {/* Logo */}
        <img src="/saas-pro-logo.svg" alt="SaaS Pro Logo" className="auth-logo-img" />

                <h1 className="auth-title">Forgot Password</h1>
                <p className="auth-subtitle">Enter your email and we'll send you a link to reset your password.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="forgot-email">Email address</label>
                        <input
                            id="forgot-email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="auth-divider" />

                <p className="auth-footer">
                    Remember your password?{' '}
                    <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
}