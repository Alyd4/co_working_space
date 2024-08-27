import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios if you need to make an API call

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user ? user.email : null;

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Pass the search query to the parent component
  };

  const handleLogout = async () => {
    try {
      // Optional: Call the API to log out if you have one
      // await axios.post('/api/auth/logout');

      // Clear user data from local storage or session storage
      localStorage.removeItem('user'); // Changed from 'email' to 'user'
     
      // Redirect to the login page or home page
      navigate('/'); // Change this to the appropriate route

      // Optionally: Clear any React state or context here
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle any errors that occur during logout
    }
  };

  return (
    <header className="flex justify-between items-center bg-white ">
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search products or services..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-[80%] text-left text-sm border rounded-md focus:outline-none"
        />
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-medium text-gray-600">{email}</span>
        <button
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          onClick={handleLogout}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
