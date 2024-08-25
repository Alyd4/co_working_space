import React, { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, item, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    deskripsi: "",
    harga: "",
    gambar: null,
    kategori: "",
    gambarUrl: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || "",
        nama: item.nama || "",
        deskripsi: item.deskripsi || "",
        harga: item.harga || "",
        gambar: null,
        kategori: item.kategori || "",
        gambarUrl: item.gambarUrl || "",
      });
      setFeatures(Array.isArray(item.fitur) ? item.fitur : []);  // Ensure features is an array
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddFeature = () => {
    if (featureInput) {
      setFeatures([...features, featureInput]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSave({ ...formData, fitur: features });
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-2/3 flex">
        {/* Left Side: Form Fields */}
        <div className="w-1/2 pr-4">
          <div className="mb-4">
            <label className="block text-gray-700">Nama:</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Deskripsi:</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Harga:</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Kategori:</label>
            <input
              type="text"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="features">
              Fitur
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="features"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Tambah Fitur
              </button>
            </div>
            <ul className="mt-2">
              {Array.isArray(features) && features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between">
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 pl-4">
          <div className="mb-4">
            <label className="block text-gray-700">Gambar:</label>
            <input
              type="file"
              name="gambar"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {formData.gambarUrl && (
              <img
                src={formData.gambarUrl}
                alt="Preview"
                className="mt-4 w-full h-auto rounded"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditModal;
