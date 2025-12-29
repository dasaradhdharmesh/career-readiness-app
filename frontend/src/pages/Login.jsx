import { useState, useEffect } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Auto-focus email input on mount
  useEffect(() => {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) emailInput.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for demo credentials
      if (email === "demo@example.com" && password === "demo123") {
        onLogin("demo-token");
        return;
      }
      
      // For Career Readiness app, you might want to show demo hint
      if (!email.includes("@example.com")) {
        setErrors({ general: "Demo: Use demo@example.com / demo123" });
      } else {
        onLogin("demo-token");
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("demo123");
    // Auto-submit after a brief delay
    setTimeout(() => handleSubmit(), 100);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Career Readiness</h2>
          <p className="login-subtitle">Sign in to track your career progress</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              onKeyPress={handleKeyPress}
              className={errors.email ? "error" : ""}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                onKeyPress={handleKeyPress}
                className={errors.password ? "error" : ""}
                disabled={isLoading}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          className="demo-btn"
          onClick={handleDemoLogin}
          disabled={isLoading}
        >
          <span className="demo-icon">🚀</span>
          Try Demo Account
        </button>

        <div className="login-footer">
          <div className="remember-forgot">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          
          <p className="signup-link">
            New to Career Readiness? <a href="#">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}