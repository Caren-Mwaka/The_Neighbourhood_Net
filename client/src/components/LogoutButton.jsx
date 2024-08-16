import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Logout response:', response);

      if (response.ok) {
        toast.success('Logged out successfully!');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(`Logout failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    }
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
