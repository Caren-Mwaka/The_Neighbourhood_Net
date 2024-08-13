import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.success("Profile updated successfully!");
      console.log("Profile updated successfully:", data);
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("user_id");
    // Redirect to login page or handle logout logic
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("user_id");
      try {
        const response = await fetch(`/api/profile?user_id=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFormData({
          username: data.username || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          password: "",
        });
        setAvatar(data.avatar || null);
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
      <ToastContainer />
      <div className={styles.contentWrapper}>
        <div className={styles.sidebarColumn}>
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>UserProfile</h2>
            <img
              src={
                avatar ||
                "https://cdn.builder.io/api/v1/image/assets/TEMP/abbf950f2a8a007869429c7e9fd0e822f1523d6d3ea027e64766fd65baab6430?placeholderIfAbsent=true&apiKey=d975cdd6201143ddb3c9da5092c113ba"
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
                alt="User avatar"
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
            <button type="submit" className={styles.updateButton}>
              Update Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
