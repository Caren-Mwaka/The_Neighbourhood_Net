import React from "react";
import './login.css'; // Import the CSS file

function Logo({ className }) {
  return (
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/1b78362580c43e2454e54d91ef96cf3f0e01215fe1055358e6d1b8c913dfe89a?apiKey=d4171c20f3c64f169e97de7e2ed39491&&apiKey=d4171c20f3c64f169e97de7e2ed39491"
      alt="Company Logo"
      className={`logo ${className}`}
    />
  );
}

export default Logo;
