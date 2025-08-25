import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiDownload, FiChevronLeft, FiChevronRight, FiUpload } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { AiOutlineFilePdf } from 'react-icons/ai';

function Penyimpanan() {
  // State untuk data dokumen
  const [documents, setDocuments] = useState([
    {
      id: '0001',
      invoice: 'INV20250611001',
      catalog: 'Produk',
      date: '11.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL001',
      documentUrl: '/documents/invoice1.pdf'
    },
    {
      id: '0002',
      invoice: 'INV20250612002',
      catalog: 'Layanan',
      date: '12.06.2025',
      category: 'Paket',
      orderNumber: 'LAYDM002',
      documentUrl: '/documents/invoice2.pdf'
    },
    {
      id: '0003',
      invoice: 'INV20250617003',
      catalog: 'Produk',
      date: '17.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL003',
      documentUrl: '/documents/invoice3.pdf'
    }
  ]);

  // State untuk invoices yang tersedia
  const [invoices, setInvoices] = useState([
    {
      id: 'INV20250611001',
      name: 'INV20250611001',
      catalog: 'Produk',
      date: '11.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL001'
    },
    {
      id: 'INV20250612002',
      name: 'INV20250612002',
      catalog: 'Layanan',
      date: '12.06.2025',
      category: 'Paket',
      orderNumber: 'LAYDM002'
    },
    {
      id: 'INV20250617003',
      name: 'INV20250617003',
      catalog: 'Produk',
      date: '17.06.2025',
      category: 'Satuan',
      orderNumber: 'PRAPL003'
    }
  ]);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState('');
  
  // State untuk filter
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  
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
      console.error('Error fetching documents:', error);
      toast.error('Error fetching documents');
    }
  };

  // Function untuk mendapatkan data invoice dari API
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/invoices`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Error fetching invoices');
    }
  };

  // Handler untuk input file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a PDF file');
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
    setSelectedInvoice(invoices[0]?.id || '');
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
      toast.error('Please select an invoice and upload a PDF file');
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
      const selectedInvoiceData = invoices.find(invoice => invoice.id === selectedInvoice);
      
      if (selectedInvoiceData) {
        const newDocument = {
          id: String(documents.length + 1).padStart(4, '0'),
          invoice: selectedInvoiceData.id,
          catalog: selectedInvoiceData.catalog,
          date: selectedInvoiceData.date,
          category: selectedInvoiceData.category,
          orderNumber: selectedInvoiceData.orderNumber,
          documentUrl: URL.createObjectURL(selectedFile)
        };
        
        setDocuments([...documents, newDocument]);
        toast.success('Document added successfully');
        setIsModalOpen(false);
      } else {
        toast.error('Selected invoice not found');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error uploading document');
    }
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter documents based on category
  const filteredDocuments = categoryFilter === 'Semua' 
    ? documents 
    : documents.filter(doc => doc.category === categoryFilter);

  return (
    <div className="h-screen bg-gray-50 w-full">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Detail Penyimpanan</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Kategori</option>
              <option value="Satuan">Satuan</option>
              <option value="Paket">Paket</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nomor invoice..."
              className="px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearchInvoice(e.target.value)}
            />
            <span className="absolute right-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <button 
            onClick={handleAddDocument}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span>Tambah Dokumen</span>
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Invoice</th>
                <th className="py-3 px-4 text-left">Katalog</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-left">Kategori</th>
                <th className="py-3 px-4 text-left">Nomor Orderan</th>
                <th className="py-3 px-4 text-left">Dokumen</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="border-b">
                  <td className="py-3 px-4">{document.id}</td>
                  <td className="py-3 px-4">{document.invoice}</td>
                  <td className="py-3 px-4">{document.catalog}</td>
                  <td className="py-3 px-4">{document.date}</td>
                  <td className="py-3 px-4">{document.category}</td>
                  <td className="py-3 px-4">{document.orderNumber}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <AiOutlineFilePdf className="text-red-500 mr-2" size={20} />
                      <a 
                        href={document.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {document.invoice}.pdf
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleDownloadDocument(document)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Download"
                    >
                      <FiDownload size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex justify-center p-4">
            <nav className="flex items-center">
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <FiChevronLeft size={16} />
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-blue-500 text-white"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                onClick={() => handlePageChange(2)}
              >
                2
              </button>
              
              <span className="mx-1">...</span>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
                onClick={() => handlePageChange(5)}
              >
                5
              </button>
              
              <button 
                className="px-3 py-1 rounded-md mx-1 bg-gray-100"
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
                <label className="block text-lg font-semibold mb-2">Nomor Invoice</label>
                <div className="relative">
                  <select
                    value={selectedInvoice}
                    onChange={handleInvoiceChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 appearance-none"
                    required
                  >
                    <option value="">Pilih nomor invoice</option>
                    {invoices.map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-2">Pilih File</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center"
                >
                  {selectedFile ? (
                    <span className="flex items-center">
                      <AiOutlineFilePdf className="text-red-500 mr-2" size={20} />
                      {selectedFile.name}
                    </span>
                  ) : (
                    <span className="text-gray-500">Klik untuk cari atau drop file anda</span>
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
  );
}

export default Penyimpanan;