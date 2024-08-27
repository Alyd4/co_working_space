import React from 'react';
import HeaderInvoice from '../components/HeaderInvoice';
import SideForm from '../components/SideForm';
import Dropdown from '../components/Invoice2';
import { BsCheckLg } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo_sembangin.png';
import { useLocation, useNavigate } from 'react-router-dom';

const InvoiceScreen = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the passed data from the previous screen
  const { name, description, price, features, img } = location.state?.data || {};
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user ? user.email : null;

  // Create a new Date object
  const today = new Date();

  // Get the day in a human-readable format (e.g., Monday)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options); // Use Indonesian locale for correct day names

  // Debugging
  console.log("Email from localStorage:", email);
  console.log("Formatted Date:", formattedDate);

 
  const handlePrint = () => {
    const printableArea = document.getElementById('printable-area').innerHTML;
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printableArea;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Refresh the page to restore content
  };

  const handleCancel = () => {
    toast(
      <div>
        <p>Apakah Anda yakin ingin membatalkan?</p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              console.log("Canceled");
              navigate('/');
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Ya
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Tidak
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const data = {
    name, 
    description,
     price,
      features,
       img, 
  };



  return (
    <div>
    <HeaderInvoice title="Co Working Space" onClose={handleCancel} />
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <SideForm
          className="w-full md:w-1/2 max-h-[500px] overflow-y-auto"
          email={email}
          date={formattedDate}
          product={data}
          onCancel={handleCancel}
          onPrint={handlePrint}
        />
        <div className="w-full md:w-1/2">
          <Dropdown title="Invoice Details">
            <div className="p-6" id="printable-area">
              <div className="border rounded-lg p-6 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-6"></div>
                <div className="mb-6 flex flex-col items-center text-center">
                  <img src={logo} alt={name} className="w-20 h-auto object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-bold">Co-Working Space</h3>
                  <p>Produk & Layanan Ruang Kerja</p>
                </div>
                <div className='flex bg-blue-600 w-full h-3 mb-10'></div>
                <h2 className='text-2xl font-bold'>Pesanan Anda</h2>
                <div className="border-t border-b py-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>Email</p>
                      <p className="font-semibold">{email}</p> 
                    </div>
                    <div>
                      <p>Tanggal</p>
                      <p className="font-semibold">{formattedDate}</p> {/* Display the dynamic date */}
                    </div>
                    <div className="col-span-2">
                      <p>Harga Total</p>
                      <p className="font-semibold">{price}</p>
                    </div>
                  </div>
                </div>
                <div className='flex justify-center'>
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
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-4 h-4 mr-2 bg-green-500 rounded-full">
                            <BsCheckLg className="text-white mr-2" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='mt-10'>
                  <div>
                    <h2 className='font-bold text-sm'>Bank isi sini</h2>
                    <p className='font-semibold'>email</p>
                  </div>
                  <div>
                    <p className='text-blue-600'>syarat dan ketentuan</p>
                  </div>
                </div>
                 
                <div className='flex justify-center'>
                  <p className='text-blue-600 text-center'>ini alamat intinya</p>
                  <p className='text-blue-600 text-center'>ini alamat intinya</p>
                </div>
                <div>
                  <p className='text-center'>no hp</p>
                </div>

                <div className='flex bg-blue-600 w-full h-3 my-5'></div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
    <ToastContainer />
    </div>
  );
};

export default InvoiceScreen;
