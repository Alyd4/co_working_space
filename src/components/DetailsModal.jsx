import React from 'react';

const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  let features = [];
  try {
    // Check if the fitur string looks like a JSON-encoded value
    const parsedFitur = JSON.parse(item.fitur);
    if (Array.isArray(parsedFitur)) {
      features = parsedFitur;
    } else if (typeof parsedFitur === 'string') {
      features = [parsedFitur];
    }
  } catch (e) {
    console.error('Error parsing fitur:', e);
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl flex flex-col">
        <div className="flex flex-col lg:flex-row">
          {/* Content Section */}
          <div className="lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold mb-4">Item Details</h2>
            <div className="mb-4">
              <strong>Nama:</strong> {item.nama}
            </div>
            <div className="mb-4">
              <strong>Deskripsi:</strong> {item.deskripsi}
            </div>
            <div className="mb-4">
              <strong>Harga:</strong> {formatPrice(item.harga)}
            </div>
            <div className="mb-4">
              <strong>Fitur:</strong> {features.length > 0 ? features.join(', ') : 'N/A'}
            </div>
            <div className="mb-4">
              <strong>Kategori:</strong> {item.kategori}
            </div>
          </div>

          {/* Image Section */}
          {item.gambarUrl && (
            <div className="lg:w-1/2 lg:pl-4 flex items-center justify-center mb-4 lg:mb-0">
              <img
                src={item.gambarUrl}
                alt={item.nama}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
