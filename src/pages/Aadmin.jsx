import React, { useState } from 'react';
import Header from '../components/Headeradmin';
import Sidebar from '../components/SideBar';
import Admin from '../components/Admin';
import ProdukLayananList from '../components/Admin2';

const Aadmin = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Admin':
                return <Admin />;
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
