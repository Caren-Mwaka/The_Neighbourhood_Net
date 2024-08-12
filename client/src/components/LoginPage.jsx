import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import "./LoginPage.css";
import logoImage2 from "../assets/images/net-logo-copy.jpeg";
import LoginButton from "./LoginButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Logo() {
  return <img src={logoImage2} alt="Logo" className="logocopy" />;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id); // Save user_id to localStorage
      localStorage.setItem("refreshToken", data.refreshToken); 
      localStorage.setItem("role", data.role);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <section className="image-section">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/66f1b2d79798fa5098c1051e41abcfdb9161928ec15a846aa739a87e1a2f6ebb?apiKey=d4171c20f3c64f169e97de7e2ed39491&&apiKey=d4171c20f3c64f169e97de7e2ed39491"
          alt="Login illustration"
          className="login-illustration"
        />
      </section>
      <section className="form-section">
        <Logo />
        <h1 className="welcome-text">Welcome back!</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <InputField
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <InputField
            label="Enter your password"
            type="password"
            showPasswordToggle={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <InputField
            label="Confirm your password"
            type="password"
            showPasswordToggle={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          {errors.general && <div className="error-text">{errors.general}</div>}
          <LoginButton loading={loading} />
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
