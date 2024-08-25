import React from 'react';
import { BsCheckLg } from "react-icons/bs";
import Absen from "../assets/presensi.png";
import Humanis from "../assets/HumanIS.png";
import Nametag from "../assets/nametag.png";
import Website from "../assets/web2.png";
import Banner from "../assets/banner.png";
import Backdrop from "../assets/backdrop.png";
import Vest from "../assets/vest.png";
import { useNavigate } from 'react-router-dom';

const products = [
  {
    name: 'Aplikasi Absen',
    description: 'Tingkatkan Efisiensi Kehadiran dengan Aplikasi Absen efektif',
    price: 'Rp.730.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Absen,
  },
  {
    name: 'Aplikasi Formulir',
    description: 'Formulir digital praktis untuk pengumpulan data',
    price: 'Rp.620.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Humanis,
  },
  {
    name: 'Website',
    description: 'Bangun Website online yang sesuai kebutuhan anda',
    price: 'Rp.590.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Website,
  },
  {
    name: 'Standing Banner',
    description: 'Standing banner menarik untuk memperkuat pesan bisnis anda',
    price: 'Rp.300.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Banner,
  },
  {
    name: 'Nametag',
    description: 'Nametag Kustom untuk Identifikasi yang Jelas dan Profesional',
    price: 'Rp.260.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Nametag,
  },
  {
    name: 'Lanyard',
    description: 'Lanyard Desain Kustom anda dengan design yang menarik',
    price: 'Rp.380.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Nametag,
  },
  {
    name: 'Backdrop',
    description: 'Backdrop Kustom untuk Latar Belakang yang Memukau di Setiap Acara',
    price: 'Rp.420.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Backdrop,
  },
  {
    name: 'Vest',
    description: 'Vest Serbaguna dengan Branding yang Menonjol untuk Acara dan Aktivitas Lapangan',
    price: 'Rp.210.000',
    features: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    img: Vest,
  },
];

const ProductCard = ({ name, description, price, features, img }) => {
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
    <div className="bg-white shadow-lg rounded-lg p-4 w-80">
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

const ProductCategory = () => (
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

export default ProductCategory;
