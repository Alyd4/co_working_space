import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditModal from "./EditModal";
import DetailsModal from "./DetailsModal";
import { TbEyeSearch } from "react-icons/tb";
import { TbPencilCog } from "react-icons/tb";
import { BiTrash } from "react-icons/bi";
import Header from "./Headeradmin";

function ItemList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/item/`);
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
        console.log("Items fetched:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data.");
      }
    };

    fetchItems();
  }, [apiUrl]);

  const handleSearch = (query) => {
    const results = items.filter((item) =>
      item.nama.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(results);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await fetch(`${apiUrl}/api/item/${id}`, { method: "DELETE" });
        setItems(items.filter((item) => item.id !== id));
        setFilteredItems(filteredItems.filter((item) => item.id !== id));
        toast.success("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Error deleting item. Please try again later.");
      }
    }
  };

  const handleEdit = (id) => {
    const item = items.find((item) => item.id === id);
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDetails = (id) => {
    const item = items.find((item) => item.id === id);
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleSave = async (updatedItem) => {
    const { id } = updatedItem;

    try {
      const formData = new FormData();
      formData.append("nama", updatedItem.nama || "");
      formData.append("deskripsi", updatedItem.deskripsi || "");
      formData.append("harga", updatedItem.harga || "");
      formData.append("fitur", updatedItem.fitur || "");
      formData.append("kategori", updatedItem.kategori || "");

      if (updatedItem.gambar instanceof File) {
        formData.append("gambar", updatedItem.gambar);
      }

      const response = await fetch(`${apiUrl}/api/item/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedItems = items.map((item) =>
          item.id === id ? updatedItem : item
        );
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        toast.success("Item updated successfully!");
      } else {
        console.error("Error updating item:", response.statusText);
        toast.error("Error updating item: " + response.statusText);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item: " + error);
    }

    setIsEditModalOpen(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ToastContainer />

      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Data Produk dan Layanan</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari data produk/layanan..."
                className="px-4 py-2 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <span className="absolute right-3 top-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center">
              <span>Cari data produk/layanan</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg drop-shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-4 text-left">No</th>
                  <th className="py-3 px-4 text-left">Gambar</th>
                  <th className="py-3 px-4 text-left">Nama Pesanan</th>
                  <th className="py-3 px-4 text-left">Harga</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={`item-${item.id}`} className="border-b">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      {item.gambarUrl ? (
                        <img
                          src={item.gambarUrl}
                          alt={item.nama}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      )}
                    </td>
                    <td className="py-3 px-4">{item.nama}</td>
                    <td className="py-3 px-4">{formatCurrency(item.harga)}</td>
                    <td className="py-3 px-4">{item.kategori}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetails(item.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Lihat"
                        >
                          <TbEyeSearch size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <TbPencilCog size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Hapus"
                        >
                          <BiTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center p-4">
              <nav className="flex items-center">
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #979797",
                    backgroundColor: "#ffffff",
                    color: "#202224",
                  }}
                >
                  &lt;
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #979797",
                    backgroundColor: "#ffffff",
                    color: "#202224",
                  }}
                >
                  1
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #979797",
                    backgroundColor: "#ffffff",
                    color: "#202224",
                  }}
                >
                  2
                </button>
                <span className="mx-1">...</span>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #979797",
                    backgroundColor: "#ffffff",
                    color: "#202224",
                  }}
                >
                  5
                </button>
                <button
                  className="flex items-center justify-center mx-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    border: "1px solid #979797",
                    backgroundColor: "#ffffff",
                    color: "#202224",
                  }}
                >
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={selectedItem}
        onSave={handleSave}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}

export default ItemList;
