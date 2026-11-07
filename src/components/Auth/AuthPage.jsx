import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AuthPage.css";

const AuthPage = ({ mode = "login" }) => {
  const isRegister = mode === "register";
  const { user, authLoading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="auth_page"><p className="auth_note">Checking your session...</p></div>;
  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) await register(form.name.trim(), form.email.trim(), form.password);
      else await login(form.email.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth_page">
      <form className="auth_card" onSubmit={handleSubmit}>
        <h1 className="auth_title">{isRegister ? "CREATE ACCOUNT" : "WELCOME BACK"}</h1>
        <p className="auth_subtitle">
          {isRegister ? "Sign up to save your cart and place orders." : "Log in to continue shopping."}
        </p>

        {error && <p className="auth_error" role="alert">{error}</p>}

        {isRegister && (
          <label className="auth_field">
            <span>Full name</span>
            <input name="name" type="text" value={form.name} onChange={handleChange} required maxLength={80} autoComplete="name" />
          </label>
        )}

        <label className="auth_field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        </label>

        <label className="auth_field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={isRegister ? 8 : undefined}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </label>

        <button className="auth_submit" type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : isRegister ? "Sign up" : "Log in"}
        </button>

        <p className="auth_switch">
          {isRegister ? "Already have an account? " : "New to Shop.Co? "}
          <Link to={isRegister ? "/login" : "/register"} state={location.state}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
