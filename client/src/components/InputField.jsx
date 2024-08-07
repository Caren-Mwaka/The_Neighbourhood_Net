import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import './LoginPage.css'; 

function InputField({
  label,
  type,
  showPasswordToggle = false,
  onChange,
  value,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? "password" : "text");
  };

  return (
    <div className="input-field-container">
      <label className="sr-only" htmlFor={`${type}Input`}>
        {label}
      </label>
      <div className="input-wrapper">
        <input
          type={inputType}
          id={`${type}Input`}
          placeholder={label}
          className={`input-field ${error ? "input-error" : ""}`}
          aria-label={label}
          value={value}
          onChange={onChange}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeIcon className="icon" />
            ) : (
              <EyeSlashIcon className="icon" />
            )}
          </button>
        )}
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default InputField;
