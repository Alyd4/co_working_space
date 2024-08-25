import React, { useState } from "react";
import axios from "axios";

function AddItem() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Produk");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage("");
    } else {
      setImage(null);
      setImagePreview(null);
      setErrorMessage("Please upload a valid image file.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = `${apiUrl}/api/item`;

      const formData = new FormData();
      formData.append("nama", itemName);
      formData.append("deskripsi", description);
      formData.append("harga", price);
      formData.append("fitur", JSON.stringify(features)); // Mengirimkan fitur sebagai string JSON
      formData.append("kategori", category);
      if (image) {
        formData.append("gambar", image);
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Item berhasil ditambahkan:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Tambah gambar
          </label>
          <div className="flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="image"
              className="flex flex-col justify-center items-center h-full w-full text-gray-500"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V8m0 0l-4 4m4-4l4 4m5-4h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m5-4h4a2 2 0 012 2v4"
                    />
                  </svg>
                  <span>Click to browse or drag and drop your files</span>
                </>
              )}
            </label>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div> <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
           Nama
          </label>
          <input
            id="Nama"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Harga
          </label>
          <input
            id="price"
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Kategori
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Produk">Produk</option>
            <option value="Layanan">Layanan</option>
            <option value="Pricing">Pricing</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
            {features.map((feature, index) => (
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Tambah Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
