import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "zjphv40j");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/djlpav9jq/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        setAvatar(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      alert("Please wait until the image upload is complete.");
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, avatar }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarColumn}>
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>User Profile</h2>
            <img
              src={
                avatar ||
                "https://res.cloudinary.com/djlpav9jq/image/upload/images_2_hvixf8"
              }
              className={styles.profileImage}
              alt="User profile"
            />
            <label htmlFor="upload-picture" className={styles.uploadButton}>
              Upload Picture
            </label>
            <input
              type="file"
              id="upload-picture"
              className={styles.visuallyHidden}
              onChange={handleImageUpload}
              accept="image/*"
            />
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </aside>
        </div>
        <div className={styles.mainColumn}>
          <form className={styles.mainContent} onSubmit={handleSubmit}>
            <div className={styles.headerWrapper}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ca809c633e39eabf604c499dde220cebfbfd013719a5287b08a4218f250461d?placeholderIfAbsent=true&apiKey=d975cdd6201143ddb3c9da5092c113ba"
                className={styles.headerImage}
                alt="Website Logo"
              />
            </div>
            <label htmlFor="username" className={styles.formLabel}>
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.formInput}
              value={formData.username}
              onChange={handleInputChange}
            />
            <label htmlFor="email" className={styles.formLabel}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              value={formData.email}
              onChange={handleInputChange}
            />
            <label htmlFor="contactNumber" className={styles.formLabel}>
              Contact Number:
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              className={styles.formInput}
              value={formData.contactNumber}
              onChange={handleInputChange}
            />
            <label htmlFor="address" className={styles.formLabel}>
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={styles.formInput}
              value={formData.address}
              onChange={handleInputChange}
            />
            <label htmlFor="password" className={styles.formLabel}>
              Password:
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={styles.formInput}
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={styles.passwordToggleButton}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
            <button
              type="submit"
              className={styles.updateButton}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
