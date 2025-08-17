import React from 'react';
import HeaderInvoice from '../components/HeaderInvoice';
import SideForm from '../components/SideForm';
import Dropdown from '../components/Invoice2';
import { BsCheckLg } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo_sembangin.png';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
 
  const handlePrint = () => {
    const printableArea = document.getElementById('printable-area').innerHTML;
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printableArea;
    window.print();
    document.body.innerHTML = originalContents;
    setTimeout(() => {
      // const isPrinted = window.confirm("Apakah Anda sudah selesai mencetak?");
      // if (isPrinted) {
      // Toast.fire({
      //     icon: "success",
      //     title: "Download Berhasil"
      // });
      // } else {
        // Toast.fire({
        //   icon: "error",
        //   title: "Download Gagal"
        // });
      // }
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Toast.fire({
                icon: "success",
                title: "Download Berhasil"
            });
        } else if (result.isDenied) {
          Toast.fire({
            icon: "error",
            title: "Download Gagal"
          });
        }
      });
    }, 500);
    
    // window.location.reload(); // Refresh the page to restore content
  };

  // const handlePrintAndConfirm = () => {
  //   window.print();
  //   setTimeout(() => {
  //     const isPrinted = window.confirm("Apakah Anda sudah selesai mencetak?");
  //     if (isPrinted) {
  //       toast.success("Terima kasih telah mencetak invoice.");
  //     } else {
  //       toast.error("Pencetakan dibatalkan.");
  //     }
  //   }, 500);
  // };

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
                    <h2 className='font-bold text-sm'>104218707148 (BANK JAGO) a.n AHMAD SYAHRONI</h2>
                    <p className='font-semibold'>pkbikepri@pkbi.or.id</p>
                  </div>
                  <div>
                    <p className='text-blue-600 font-semibold mt-3'>Syarat dan Ketentuan:</p>
                    <p className='text-gray-50 font-medium mb-10'>Jika sudah membayar ke Bank yang telah ditentukan, silahkan upload invoice dan bukti pembayaran ke email yang tertera, selanjutnya akan kami buatkan SPK (Surat Perjanjian Kerjasama) untuk komunitas anda</p>
                  </div>
                </div>
                 
                <div className='font-semibold'>
                  <p className='text-blue-600 text-center'>Jalan Kaka Tua II, Desa Toapaya Selatan, RT/RW 001/001, Kec,</p>
                  <p className='text-center text-blue-600'>Toapaya, Kabupaten Bintan, Kepulauan Riau, Indonesia</p>
                </div>
                <div>
                  <p className='text-center font-semibold text-black'>Hubungi: +62 823-8814-9914</p>
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
