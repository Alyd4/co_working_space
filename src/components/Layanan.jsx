import { BsCheckLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const products = [
  {
    name: 'Pembuatan Domain',
    description: 'Dapatkan Nama Domain yang Tepat untuk Memperkuat Brand Anda.',
    price: 'Rp.730.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
  },
  {
    name: 'Hosting Web',
    description: 'Hosting Terpercaya yang Menjamin Website Anda Selalu Siap diakses',
    price: 'Rp.620.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
  },
  {
    name: 'Permintaan Layanan',
    description: 'Request Layanan sesuai kebutuhan anda',
    price: '',
    features: [],
  },
];

const ProductCard = ({ name, description, price, features, img }) => {
  const isCostume = name === 'Permintaan Layanan';
  const navigate = useNavigate();

  const handleBuyClick = () => {
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
    <div className="bg-white shadow-lg rounded-lg p-4 w-80 flex flex-col justify-between h-full">
      {/* Product Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="text-lg font-bold text-blue-600 mb-2">{price}</p>
      </div>

      {/* Features List */}
      <ul className="text-sm text-gray-600 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full flex justify-center items-center">
              <BsCheckLg className="text-white" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* Buy Button(s) */}
      <div className="mt-auto">
        {!isCostume && (
          <button className="bg-blue-600 text-white py-2 px-4 rounded-xl w-[80%] mx-auto my-2 block" onClick={handleBuyClick}>
            Beli
          </button>
        )}
        {isCostume && (
          <button className="bg-blue-600 text-white py-2 px-4 rounded-xl w-[80%] mx-auto block " onClick={handleBuyClick}>
            Beli
          </button>
        )}
      </div>
    </div>
  );
};
const ProductCategory = () => (
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

export default ProductCategory;
