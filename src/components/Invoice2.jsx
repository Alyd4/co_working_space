import React, { useState } from 'react';

const Dropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow rounded-lg w-full max-w-full p-4">
      <button 
        className="w-full text-left font-semibold text-blue-600 focus:outline-none"
        onClick={toggleDropdown}
      >
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
