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
    const results = items.filter(item =>
      item.nama.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(results);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
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
    <div className="flex flex-col items-center bg-white-100 p-8">
      <ToastContainer />

      {/* Full-width Header */}
      <div className="w-full bg-black">
        <Header onSearch={handleSearch} />
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={`item-${item.id}`} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.gambarUrl && (
                      <img
                        src={item.gambarUrl}
                        alt={item.nama}
                        className="w-10 h-10 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(item.harga)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.kategori}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <button
                      onClick={() => handleDetails(item.id)}
                      className="text-green-500 hover:text-green-700 mr-4"
                    >
                      <TbEyeSearch className="w-6 h-6"/>
                    </button>
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <TbPencilCog className="w-6 h-6"/>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                    <BiTrash className="w-6 h-6"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
