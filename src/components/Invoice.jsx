import React from 'react';
import { useLocation } from 'react-router-dom';

const Invoice = () => {
  const location = useLocation(); // Get the passed data from the previous screen
  const { name, description, price, features, img } = location.state?.data || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="lg:w-1/3 p-6 bg-gray-100">
        <h2 className="text-lg font-bold mb-4">Detail Invoice</h2>
        <div className="mb-6">
          <p>Kepada:</p>
          <p className="font-semibold">Muhammad Haris</p>
          <p>Email: dewaharis@gmail.com</p>
          <p>Tanggal: Sabtu, 11 Agustus 2024</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Produk / Layanan</h3>
          <div className="flex items-center bg-white shadow-lg rounded-lg p-4">
            {img && (  // Conditionally render the image if it exists
              <img
                src={img}
                alt={name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
            )}
            <div>
              <p className="text-md font-bold">{name}</p>
              <p className="text-green-600 font-semibold">{price}</p>
              <ul className="text-gray-500 text-sm mt-2">
                {features?.map((feature, index) => (
                  <li key={index}>- {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-6 w-full"
        >
          Cetak Invoice
        </button>
        <button className="mt-4 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg w-full">
          Batal
        </button>
      </div>

      {/* Invoice Preview */}
      <div className="lg:w-2/3 p-6">
        <div className="border rounded-lg p-6 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Invoice Anda</h2>
            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded-lg">
              Tutup
            </button>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold">Co-Working Space</h3>
            <p>Produk & Layanan Ruang Kerja</p>
          </div>
          <div className="border-t border-b py-4 mb-6">
            <div className="flex justify-between">
              <div>
                <p>Nama</p>
                <p className="font-semibold">Muhammad Haris</p>
              </div>
              <div>
                <p>Tanggal</p>
                <p className="font-semibold">Sabtu, 11 Agustus 2024</p>
              </div>
              <div>
                <p>Email</p>
                <p className="font-semibold">dewaharis@gmail.com</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{name}</p>
                <p className="text-sm text-gray-500">
                  {description}
                </p>
              </div>
              <p className="font-bold text-lg">{price}</p>
            </div>
            <ul className="text-gray-500 text-sm mt-4">
              {features?.map((feature, index) => (
                <li key={index}>- {feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end mt-6">
            <p className="font-bold text-xl">Total: {price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
