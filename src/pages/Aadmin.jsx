import React, { useState } from 'react';
import Header from '../components/Headeradmin';
import Sidebar from '../components/SideBar';
import Dashboard from '../components/Dashboard';
import KelolaPelanggan from '../components/KelolaPelanggan';
import Pesan from '../components/Pesan';
import KelolaPromosi from '../components/KelolaPromosi';
import KelolaPesanan from '../components/KelolaPesanan';
import Penyimpanan from '../components/Penyimpanan';
import Admin from '../components/Admin';
import Laporan from '../components/Laporan';
import ProdukLayananList from '../components/Admin2';

const Aadmin = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Admin':
                return <Admin />;
            case 'Dashboard':
                return <Dashboard />;
            case 'KelolaPelanggan':
                return <KelolaPelanggan />;
            case 'Pesan':
                return <Pesan />;
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
                return <ProdukLayananList />;
        }
    };

    const handleSearch = (query) => {
        // Pass the search query to the current component if it supports searching
        if (activeComponent === 'ProdukLayananList') {
            // assuming ProdukLayananList has the handleSearch prop
            setActiveComponent(<ProdukLayananList onSearch={handleSearch} />);
        }
    };

    return (
        <>
            
            <div className="flex">
                {/* Sidebar */}
                <Sidebar setActiveComponent={setActiveComponent} />
                
                {/* Main Content */}
                <div className="flex-grow p-6">
                    {renderComponent()}
                </div>
            </div>
        </>
    );
}

export default Aadmin;
