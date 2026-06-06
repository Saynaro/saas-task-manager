import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { setAccessToken } from '../utils/apiFetch'
import { apiFetch } from '../utils/apiFetch'
import { handleRateLimit } from '../utils/handleRateLimit'
import logo from '../assets/saas-pro-logo.svg'
import './Auth.css'


export function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isEmailInvalid = formData.email.length > 0 && !emailRegex.test(formData.email);
  const isPasswordInvalid = formData.password.length > 0 && !passwordRegex.test(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()


    //connection to backend

    try {
      const response = await apiFetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (handleRateLimit(response, data)) return;

      if (!response.ok) {

        if (data.error === "Invalid email or password" || data.message === "Invalid email or password" || response.status === 401) {
          toast.error("Invalid email or password");
        } else {
          toast.error(data.message || data.error || "Login failed");
        }
        return;
      }

      //handle response
      if (response.ok) {
        setAccessToken(data.data.accessToken);

        // Fetch full profile (includes role, workspace, allWorkspaces)
        const meRes = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
          headers: { "Authorization": `Bearer ${data.data.accessToken}` }
        });
        const meData = await meRes.json();
        const fullUser = meData.data?.user || data.data.user;

        toast.success("Welcome back!");
        onLoginSuccess?.(fullUser);
        navigate("/dashboard");
      }
      console.log(data);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* Logo */}
        <img src={logo} alt="SaaS Pro Logo" className="auth-logo-img" />

        <h1 className="auth-title">Sign in to SaaS Pro</h1>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className={isEmailInvalid ? "invalid-input" : ""}
            />
            {isEmailInvalid && <span className="error-text">Invalid email format</span>}
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password" className="auth-link forgot-link">Forgot password?</Link>
            </div>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={isPasswordInvalid ? "invalid-input" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {isPasswordInvalid && (
              <span className="error-text" style={{ marginTop: '4px' }}>Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.</span>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        {/* OR divider */}
        <div className="or-divider">
          <span className="or-line" />
          <span className="or-text">OR</span>
          <span className="or-line" />
        </div>

        {/* Google SSO */}
        <button className="google-btn" type="button"
          onClick={() => {
            window.location.href = 'http://localhost:5001/api/auth/google';
          }}
        >
          {/* Google coloured G */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.84 14.62 48 24 48z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.16 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider" />

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  )
}
