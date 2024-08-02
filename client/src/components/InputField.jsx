import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
    <div className="mb-8">
      <label className="sr-only" htmlFor={`${type}Input`}>
        {label}
      </label>
      <div className="flex flex-col">
        <div className="flex items-center border-b-2 border-neutral-800 border-opacity-20 focus-within:border-opacity-100">
          <input
            type={inputType}
            id={`${type}Input`}
            placeholder={label}
            className={`w-full py-4 text-2xl font-semibold text-neutral-800 bg-transparent focus:outline-none ${
              error ? "border-red-500" : ""
            }`}
            aria-label={label}
            value={value}
            onChange={onChange}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="w-7 h-7 text-neutral-800" />
              ) : (
                <EyeSlashIcon className="w-7 h-7 text-neutral-800" />
              )}
            </button>
          )}
        </div>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>
    </div>
  );
}

export default InputField;
