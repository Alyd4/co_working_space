import React from "react";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import axios from "axios"; // Import axios if you need to make an API call

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Call the API to log out if you have one
      // await axios.post('/api/auth/logout');

      // Clear user data from local storage or session storage
      localStorage.removeItem("user"); // Changed from 'email' to 'user'
      localStorage.removeItem("user"); // Changed from 'email' to 'user'

      // Redirect to the login page or home page
      navigate("/"); // Change this to the appropriate route

      // Optionally: Clear any React state or context here
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle any errors that occur during logout
    }
  };

  return (
    <header className="flex justify-end items-center bg-white p-4">
      <div className="flex items-center">
        <button
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full"
          onClick={handleLogout}
        >
          <LuLogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
