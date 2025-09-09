import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiEye,
  FiEdit,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AiOutlineFilePdf } from "react-icons/ai";
import Header from "./Headeradmin";

function Penyimpanan() {
  // State untuk data dokumen
  const [documents, setDocuments] = useState([
    {
      id: "0001",
      invoice: "INV20250611001",
      catalog: "Produk",
      date: "11.06.2025",
      category: "Satuan",
      orderNumber: "PRAPL001",
      documentUrl: "/documents/invoice1.pdf",
    },
    {
      id: "0002",
      invoice: "INV20250612002",
      catalog: "Layanan",
      date: "12.06.2025",
      category: "Paket",
      orderNumber: "LAYDM002",
      documentUrl: "/documents/invoice2.pdf",
    },
    {
      id: "0003",
      invoice: "INV20250617003",
      catalog: "Produk",
      date: "17.06.2025",
      category: "Satuan",
      orderNumber: "PRAPL003",
      documentUrl: "/documents/invoice3.pdf",
    },
  ]);

  // State untuk invoices yang tersedia
  const [invoices, setInvoices] = useState([
    {
      id: "INV20250611001",
      name: "INV20250611001",
      catalog: "Produk",
      date: "11.06.2025",
      category: "Satuan",
      orderNumber: "PRAPL001",
    },
    {
      id: "INV20250612002",
      name: "INV20250612002",
      catalog: "Layanan",
      date: "12.06.2025",
      category: "Paket",
      orderNumber: "LAYDM002",
    },
    {
      id: "INV20250617003",
      name: "INV20250617003",
      catalog: "Produk",
      date: "17.06.2025",
      category: "Satuan",
      orderNumber: "PRAPL003",
    },
  ]);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  // State untuk filter
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch data dokumen saat komponen dimuat
  useEffect(() => {
    // fetchDocuments();
  }, []);

  // Function untuk mendapatkan data dokumen dari API
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/documents`);
      setDocuments(response.data);
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error fetching documents");
    }
  };

  // Function untuk mendapatkan data invoice dari API
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Error fetching invoices");
    }
  };

  // Handler untuk input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF file");
        setSelectedFile(null);
      }
    }
  };

  // Handler untuk perubahan invoice
  const handleInvoiceChange = (e) => {
    setSelectedInvoice(e.target.value);
  };

  // Handler untuk membuka modal tambah dokumen
  const handleAddDocument = () => {
    setSelectedFile(null);
    setSelectedInvoice(invoices[0]?.id || "");
    setIsModalOpen(true);
  };

  // Handler untuk mencari nomor invoice
  const handleSearchInvoice = (query) => {
    // Filter invoices based on query
    // This would be handled by your backend API in a real implementation
  };

  // Handler untuk download dokumen
  const handleDownloadDocument = (document) => {
    // In a real application, this would initiate a file download
    toast.info(`Downloading document: ${document.invoice}`);
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !selectedInvoice) {
      toast.error("Please select an invoice and upload a PDF file");
      return;
    }

    try {
      // In a real application, you would upload the file to your server
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('invoice', selectedInvoice);

      // const response = await axios.post(`${apiUrl}/api/documents`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // Simulate API response
      const selectedInvoiceData = invoices.find(
        (invoice) => invoice.id === selectedInvoice
      );

      if (selectedInvoiceData) {
        const newDocument = {
          id: String(documents.length + 1).padStart(4, "0"),
          invoice: selectedInvoiceData.id,
          catalog: selectedInvoiceData.catalog,
          date: selectedInvoiceData.date,
          category: selectedInvoiceData.category,
          orderNumber: selectedInvoiceData.orderNumber,
          documentUrl: URL.createObjectURL(selectedFile),
        };

        setDocuments([...documents, newDocument]);
        toast.success("Document added successfully");
        setIsModalOpen(false);
      } else {
        toast.error("Selected invoice not found");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Error uploading document");
    }
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter documents based on category
  const filteredDocuments =
    categoryFilter === "Semua"
      ? documents
      : documents.filter((doc) => doc.category === categoryFilter);

  // Function untuk handle search
  const handleSearch = (query) => {
    // Implementasi search untuk filter dokumen
    console.log("Search query:", query);
    // Bisa ditambahkan logika untuk filter documents berdasarkan query
  };

  return (
    <div className="flex flex-col bg-white">
      <ToastContainer />

      {/* Header dengan Search Bar dan Logout */}
      <div className="w-full bg-black mb-6">
        <Header />
      </div>

      <div className="h-screen bg-white w-full">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Detail Penyimpanan</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 border-2 focus:outline-none appearance-none text-center"
                style={{
                  borderColor: "#FAAD4F",
                  color: "#FAAD4F",
                  width: "111px",
                  height: "28px",
                  fontSize: "12px",
                  borderRadius: "500px",
                  lineHeight: "1.2",
                }}
              >
                <option value="Semua">Kategori</option>
                <option value="Satuan">Satuan</option>
                <option value="Paket">Paket</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="fill-current h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  style={{ color: "#FAAD4F" }}
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari nomor invoice..."
                className="px-3 py-1 border-2 focus:outline-none"
                style={{
                  borderColor: "#0070D8",
                  color: "#0070D8",
                  width: "222px",
                  height: "28px",
                  fontSize: "14px",
                  borderRadius: "500px",
                }}
                onChange={(e) => handleSearchInvoice(e.target.value)}
              />
              <style>
                {`
                  .relative input::placeholder {
                    color: #0070D8 !important;
                    opacity: 0.7;
                  }
                `}
              </style>
            </div>

            <button
              onClick={handleAddDocument}
              className="border-2 hover:bg-green-50 px-3 py-1 flex items-center"
              style={{
                borderColor: "#00B69B",
                color: "#00B69B",
                width: "141px",
                height: "28px",
                fontSize: "11px",
                borderRadius: "500px",
              }}
            >
              <span>Tambah Dokumen</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-lg drop-shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th
                    className="py-3 px-4 text-center"
                    style={{ borderRadius: "500px 0 0 500px" }}
                  >
                    ID
                  </th>
                  <th className="py-3 px-4 text-center">Invoice</th>
                  <th className="py-3 px-4 text-center">Katalog</th>
                  <th className="py-3 px-4 text-center">Tanggal</th>
                  <th className="py-3 px-4 text-center">Kategori</th>
                  <th className="py-3 px-4 text-center">Nomor Orderan</th>
                  <th className="py-3 px-4 text-center">Dokumen</th>
                  <th
                    className="py-3 px-4 text-center"
                    style={{ borderRadius: "0 500px 500px 0" }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody style={{ opacity: 0.8 }}>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="border-b">
                    <td className="py-3 px-4 text-center">{document.id}</td>
                    <td className="py-3 px-4 text-center">
                      {document.invoice}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {document.catalog}
                    </td>
                    <td className="py-3 px-4 text-center">{document.date}</td>
                    <td className="py-3 px-4 text-center">
                      {document.category}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {document.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <AiOutlineFilePdf
                          className="text-red-500 cursor-pointer"
                          size={24}
                          onClick={() =>
                            window.open(document.documentUrl, "_blank")
                          }
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            window.open(document.documentUrl, "_blank")
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Lihat"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(document)}
                          className="text-green-500 hover:text-green-700"
                          title="Edit"
                        >
                          <FiEdit size={18} />
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
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FiChevronLeft size={16} />
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
                  onClick={() => handlePageChange(1)}
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
                  onClick={() => handlePageChange(2)}
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
                  onClick={() => handlePageChange(5)}
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
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FiChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal Add Document */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tambah Dokumen</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <hr className="mb-6" />

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-2">
                    Nomor Invoice
                  </label>
                  <div className="relative">
                    <select
                      value={selectedInvoice}
                      onChange={handleInvoiceChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                      required
                    >
                      <option value="">Pilih nomor invoice</option>
                      {invoices.map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                          {invoice.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-2">
                    Pilih File
                  </label>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center"
                  >
                    {selectedFile ? (
                      <span className="flex items-center">
                        <AiOutlineFilePdf
                          className="text-red-500 mr-2"
                          size={20}
                        />
                        {selectedFile.name}
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        Klik untuk cari atau drop file anda
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
                >
                  Tambah
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Penyimpanan;
