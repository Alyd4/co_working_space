import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from "../components/Headeradmin";
import Sidebar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import KelolaPelanggan from '../components/KelolaPelanggan';
import PesanChat from '../components/PesanChat'; // Updated import
import KelolaPromosi from '../components/KelolaPromosi';
import KelolaPesanan from '../components/KelolaPesanan';
import Penyimpanan from '../components/Penyimpanan';
import Admin from '../components/Admin';
import Laporan from '../components/Laporan';
import ProdukLayananList from '../components/ProdukLayanan';

const Aadmin = ({ activeView }) => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Set active component berdasarkan activeView prop
    if (activeView) {
      setActiveComponent(activeView);
    }
  }, [activeView]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Admin':
        return <Admin />;
      case 'Dashboard':
        return <Dashboard />;
      case 'KelolaPelanggan':
        return <KelolaPelanggan />;
      case 'Pesan':
        return <PesanChat />;
      case 'KelolaPromosi':
        return <KelolaPromosi />;
      case 'KelolaPesanan':
        return <KelolaPesanan />;
      case 'Penyimpanan':
        return <Penyimpanan />;
      case 'Laporan':
        return <Laporan />;
      case 'ProdukLayananList':
        return <ProdukLayananList />;
      default:
        return <Dashboard />;
    }
  };

  const handleSearch = query => {
    // Pass the search query to the current component if it supports searching
    if (activeComponent === 'ProdukLayananList') {
      // assuming ProdukLayananList has the handleSearch prop
      setActiveComponent(<ProdukLayananList onSearch={handleSearch} />);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
          navigate={navigate}
        />

        {/* Main Content */}
        <div className="flex-grow p-6 ml-64 overflow-auto">
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Aadmin;
