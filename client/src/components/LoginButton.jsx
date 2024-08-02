import React from "react";

function LoginButton({ loading }) {
  return (
    <button
      type="submit"
      className={`w-full py-4 mt-10 text-2xl font-semibold text-center text-white bg-emerald-400 rounded-full hover:bg-emerald-500 transition-colors duration-300 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? "Loading..." : "Login"}
    </button>
  );
}

export default LoginButton;
