import React, { useState } from "react";
import InputField from "./InputField";
import LoginButton from "./LoginButton";
import Logo from "./Logo";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-cyan-50">
      <section className="hidden md:flex md:w-1/2 items-center justify-center pl-12">
        {" "}
        {/* Increased padding-left */}
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/66f1b2d79798fa5098c1051e41abcfdb9161928ec15a846aa739a87e1a2f6ebb?apiKey=d4171c20f3c64f169e97de7e2ed39491&&apiKey=d4171c20f3c64f169e97de7e2ed39491"
          alt="Login illustration"
          className="object-contain max-w-full max-h-[80vh] mb-2" // Retained the previous margin-bottom
        />
      </section>
      <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-2">
        <Logo className="mb-2" />
        <h1 className="text-5xl font-black text-black mb-4">Welcome back!</h1>
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
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
          {errors.general && (
            <div className="text-red-500 text-sm mb-4">{errors.general}</div>
          )}
          <LoginButton loading={loading} />
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
