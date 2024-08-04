import React from "react";
import './login.css'; 

function LoginButton({ loading }) {
  return (
    <button
      type="submit"
      className={`login-button ${loading ? "button-disabled" : ""}`}
      disabled={loading}
    >
      {loading ? "Loading..." : "Login"}
    </button>
  );
}

export default LoginButton;
