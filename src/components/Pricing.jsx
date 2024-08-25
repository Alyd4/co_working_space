import React, { useEffect, useState } from 'react';
import { BsCheckLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ name, description, price, features }) => {
  const navigate = useNavigate();
  const isPremium = name === 'Premium';
  const isCustom = name === 'Custom';

  const handleBuyClick = () => {
    const data = {
      name,
      description,
      price,
      features,
    };

    navigate('/invoice', { state: { data } });
  };

  return (
    <div className={`bg-white rounded-5xl h-[500px] p-5 flex flex-col ${isPremium ? 'shadow-lg shadow-blue-500 border-4 border-blue-500' : 'shadow-lg shadow-blue-500'}`}>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-center">{name}</h3>
        <p className="text-sm text-gray-600 mb-2 text-left">{description}</p>
        <p className="text-lg font-bold text-blue-600 mb-2 text-left">{price}</p>

        {!isCustom && (
          <button className="bg-blue-600 text-white py-2 px-4 rounded-xl w-[80%] mx-auto my-2" onClick={handleBuyClick}>
            Beli
          </button>
        )}

        {/* Render features as a list of individual items */}
        {Array.isArray(features) && features.length > 0 && (
          <ul className="text-sm text-gray-600 mb-4 text-center mt-5">
            {features.map((feature, index) => (
              <li key={index} className="flex">
                <div className="w-4 h-4 mr-2 bg-green-500 rounded-xl flex items-center justify-center">
                  <BsCheckLg className="text-white" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCustom && (
        <button className="bg-blue-600 text-white py-2 px-4 rounded-xl w-[80%] mx-auto my-2 mt-auto" onClick={handleBuyClick}>
          Beli
        </button>
      )}
    </div>
  );
};

const ProductCategory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://10.10.10.254:5000/api/item/');
        const data = await response.json();
        console.log(data)

        // Process the data to parse features JSON strings
        const processedData = data.map(item => {
          let parsedFeatures;
          
          try {
            // Parse the fitur string into an array if it's a valid JSON string
            parsedFeatures = JSON.parse(item.fitur);

            // Ensure parsedFeatures is an array
            if (!Array.isArray(parsedFeatures)) {
              parsedFeatures = [parsedFeatures];
            }
          } catch (e) {
            // If parsing fails, handle the single string or invalid JSON gracefully
            console.error('Failed to parse fitur:', e);
            console.log('Using single string as fitur:', parsedFeatures);
            parsedFeatures = [item.fitur.replace(/['"]+/g, '')]; // Remove quotes if it's not a JSON array
          }

          return {
            name: item.nama,
            description: item.deskripsi,
            price: `Rp ${parseFloat(item.harga).toLocaleString('id-ID', { minimumFractionDigits: 2 })}/Bulan`,
            features: parsedFeatures,
          };
        });

        setProducts(processedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white py-10 px-4 text-center">
      <h2 className="text-2xl font-bold text-black mb-4">Paket Penawaran</h2>
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Penawaran Harga Terbaik untuk Semua Kebutuhan Anda</h1>
      <p className="text-gray-600 mb-8">Platform Penjualan Produk dan Layanan Ruang Kerja Virtual untuk Komunitas</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-10">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategory;
