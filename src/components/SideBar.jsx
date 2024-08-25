import React from "react";

function Sidebar({ setActiveComponent }) {
  return (
    <div className="w-64 h-screen bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-blue-600">Co-Working Space</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <li>
            <button
              onClick={() => setActiveComponent('Admin')}
              className="w-full text-left flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="mx-4 font-medium">Tambah Produk / Layanan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent('ProdukLayananList')}
              className="w-full text-left flex items-center px-6 py-2 mt-4 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
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
                  d="M3 7h18M9 12h6m-6 5h6"
                />
              </svg>
              <span className="mx-4 font-medium">Produk / Layanan List</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
