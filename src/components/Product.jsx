import React, { useEffect, useState } from 'react';
import { BsCheckLg } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;


const ProductCard = ({ name, description, price,  features = [], img }) => {
  const navigate = useNavigate();


  const handleBuyClick = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user ? user.email : null;
  
    if (!email) {
      // Redirect to login page if email is not found
      navigate('/login');
      return;
    }
    // Prepare data to be passed
    const data = {
      name,
      description,
      price,
      features,
      img,

      
    };

    // Navigate to another screen and pass data
    navigate('/invoice', { state: { data } });
  };


  const validFeatures = (features || []).filter(
    (feature) => feature && feature.trim() !== '""'
  );
  
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-80 flex flex-col">
    <div className="flex flex-col flex-grow">
      <div className="flex flex-row mb-4">
        <div className="flex flex-col w-[80%]">
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-2 break-words">{description}</p>
          {price !== "Rp 0,00/Bulan" && (
            <p className="text-lg font-bold text-blue-600 mb-2">{price}</p>
          )}
        </div>
        {img && (
          <img src={img} alt={name} className="h-32 w-full object-contain rounded-lg mb-4" />
        )}
      </div>
      {validFeatures.length > 0 && (
        <ul className="text-sm text-gray-600 mb-4">
          {validFeatures.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-green-500 rounded-full">
                <BsCheckLg className="text-white mr-2" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="flex justify-center mt-auto mb-5">
      <button onClick={handleBuyClick} className="bg-blue-600 w-[80%] text-white py-2 px-4 rounded-lg">
        Beli
      </button>
    </div>
  </div>
  );
};


const ProductCategory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/item/`);
        const data = await response.json();
        console.log(data);
  
        // Filter the data to include only items in the "Pricing" category
        const filteredData = data.filter(item => item.kategori === 'Produk');
  
        // Process the filtered data to parse features JSON strings
        const processedData = filteredData.map(item => {
          let parsedFeatures;
  
          try {
            // Try parsing the fitur twice to handle double-encoded strings
            parsedFeatures = JSON.parse(item.fitur);
  
            // Check if parsedFeatures is still a string and needs further parsing
            if (typeof parsedFeatures === 'string') {
              parsedFeatures = JSON.parse(parsedFeatures);
            }
  
            // Ensure parsedFeatures is an array, if it's a single string, wrap it in an array
            if (!Array.isArray(parsedFeatures)) {
              parsedFeatures = [parsedFeatures];
            }
          } catch (e) {
            // If parsing fails, assume it's a simple string, split by commas, and clean quotes
            parsedFeatures = item.fitur.replace(/['"]+/g, '').split(',').map(f => f.trim());
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
  <div className="bg-white py-8 px-12 pt-28 pb-12">
    <h2 className="text-2xl font-bold text-blue-600 mb-4">Kategori Produk</h2>
    <p className="text-gray-600 mb-8">Dari aplikasi hingga desain visual yang mengesankan, kami menyediakan segala yang dibutuhkan untuk mengoptimalkan operasional anda dan memperkuat identitas brand di setiap event dan lingkungan kerja.</p>
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mx-52 ">
      {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  </div>
);
}

export default ProductCategory;
