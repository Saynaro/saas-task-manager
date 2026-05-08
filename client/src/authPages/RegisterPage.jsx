import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import './Auth.css'

export function RegisterPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    inviteCode: '',
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isEmailInvalid = formData.email.length > 0 && !emailRegex.test(formData.email);
  const isPasswordInvalid = formData.password.length > 0 && !passwordRegex.test(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()


    // connect to backend
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          inviteCode: formData.inviteCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || data.error || "Registration failed");
        return;
      }

      if (response.ok) {
        toast.success("Account created successfully!");
        onLoginSuccess?.(data.data.user);
        window.location.href = "/";
      }
      console.log(data);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start your 14-day free trial. No credit card required.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-firstName">First Name</label>
              <input
                id="reg-firstName"
                type="text"
                name="firstName"
                placeholder="Khalid"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-lastName">Last Name</label>
              <input
                id="reg-lastName"
                type="text"
                name="lastName"
                placeholder="Sainaro"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="reg-email">Work Email</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="khalid@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={isEmailInvalid ? "invalid-input" : ""}
                required
              />
              {isEmailInvalid && <span className="error-text">Check email email format.</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-invite">Invite Code</label>
              <input
                id="reg-invite"
                type="text"
                name="inviteCode"
                placeholder="PRO-2024"
                value={formData.inviteCode}
                onChange={handleChange}
              />
            </div>
          </div>



          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={isPasswordInvalid ? "invalid-input" : ""}
                required
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
            {isPasswordInvalid ? (
              <span className="error-text">Must be at least 8 characters and contain 1 uppercase, 1 lowercase, and 1 number.</span>
            ) : (
              <span className="form-hint">Must be at least 8 characters.</span>
            )}
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              id="reg-terms"
            />
            <span>
              I agree to the <a href="#" className="auth-link">Terms</a> and <a href="#" className="auth-link">Privacy</a>.
            </span>
          </label>

          <button type="submit" className="auth-btn" disabled={!agreed}>
            Register
          </button>
        </form>


        <div className="auth-divider" />

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  )
}
