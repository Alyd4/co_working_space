import { BsCheckLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;


const ProductCard = ({ name, description, price, features, img }) => {
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-4  w-full sm:w-64 md:w-80 lg:w-96 xl:w-[24rem]">
      <div className="flex flex-row">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-lg font-bold text-blue-600 mb-2">{price}</p>
        </div>
        {img && (
          <img src={img} alt={name} className="h-32 w-full object-contain rounded-lg mb-4" />
        )}
      </div>
      <ul className="text-sm text-gray-600 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full">
              <BsCheckLg className="text-white mr-2" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-10 mb-5">
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
        const filteredData = data.filter(item => item.kategori === 'Layanan');
  
        // Process the filtered data to parse features JSON strings
        const processedData = filteredData.map(item => {
          let parsedFeatures;
          
          try {
            // Parse the fitur string twice because it's double-encoded
            parsedFeatures = JSON.parse(JSON.parse(item.fitur));
            
            // Ensure parsedFeatures is an array
            if (!Array.isArray(parsedFeatures)) {
              parsedFeatures = [parsedFeatures];
            }
          } catch (e) {
            // If parsing fails, handle the single string or invalid JSON gracefully
            console.error('Failed to parse fitur:', e);
            parsedFeatures = [item.fitur.replace(/['"]+/g, '')]; // Remove quotes if it's not a JSON array
          }
  
          return {

            name: item.nama,
            description: item.deskripsi,
            price: `Rp ${parseFloat(item.harga).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
            features: parsedFeatures,
            img: item.gambarUrl
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
    <h2 className="text-2xl font-bold text-blue-600 mb-4">Kategori Layanan</h2>
    <p className="text-gray-600 mb-8">Dari Pembuatan Domain hingga Web Hosting dan Layanan Digital Lainnya, Kami Hadir untuk Membantu Anda Membangun dan Mengoptimalkan Kehadiran Online dengan Solusi yang Dapat Diandalkan, Cepat, dan Mendukung Pertumbuhan Bisnis Anda di Era Digital.</p>
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mx-52">
    {products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  </div>
);
}
export default ProductCategory;
