import React from 'react';
import { BsCheckLg } from "react-icons/bs";

const SideForm = ({ email, date, product, onCancel, onPrint }) => {
  const { name, description, price, features, img } = product;

  return (
    <div className="bg-white p-6 shadow rounded-lg w-full md:w-1/3">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Detail Invoice</h2>
      <div className="mb-4">
        <label className="block text-gray-600">Email:</label>
        <p className="text-gray-800">{email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600">Tanggal:</label>
        <p className="text-gray-800">{date}</p>
      </div>
      <h3 className="text-lg font-semibold text-blue-600 mb-2">Produk / Layanan</h3>
      <div className="bg-white shadow-lg drop-shadow-lg rounded-lg p-4 w-full">
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
          {features && features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-green-500 rounded-full">
                <BsCheckLg className="text-white mr-2" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onCancel} className="bg-gray-400 text-white py-2 px-4 rounded-lg">Batal</button>
        <button onClick={onPrint} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Cetak invoice</button>
      </div>
    </div>
  );
};

export default SideForm;
