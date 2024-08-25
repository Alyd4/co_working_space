import React, { useState } from 'react';
import { CgChevronDown } from "react-icons/cg";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='border-b'>
      <button
        onClick={toggleDropdown}
        className='w-full flex justify-between items-center py-4'
      >
        <h2 className='text-lg font-medium'>{question}</h2>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
        <CgChevronDown />
        </span>
      </button>

      {isOpen && (
        <div className='pb-4'>
          <p className='text-sm text-gray-600'>{answer}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className='m-5 md:m-20'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-blue-500 text-center mb-10'>
        Bergabunglah dengan Kami Dan Jadikan Segala Sesuatu yang Anda Lebih Baik
        </h1>
        <h3 className='font-semibold text-xl text-center mb-2'>
          FAQs
        </h3>
        <h2 className='text-3xl md:text-3xl font-extrabold text-blue-500 text-center mb-3'>
        Frequently Asked Questions
        </h2>
        <p className='font-medium text-center mb-10 text-gray-50'>
        Platform Penjualan Produk dan Layanan Ruang Kerja Virtual untuk Komunitas
        </p>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mx-96'>
      <FAQItem
        question="gimana cara belinya?"
        answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut..."
      />
      <FAQItem
        question="Kenapa hanya untuk komunitas?"
        answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut..."
      />
      <FAQItem
        question="Apakah sembangin ini bagian dari PKBI juga?"
        answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut..."
      />
      </div>
      <h1 className='text- font-medium text-gray-50 mt-5 mx-96'>Masih ada yang mau ditanyakan? Email kita <a href="mailto:pkbikepri@pkbi.or.id?subject=Inquiry&body=Hello,%20I%20would%20like%20to%20know%20more%20about...&cc=cc@pkbi.or.id&bcc=bcc@pkbi.or.id" className="text-blue-500 hover:underline">pkbikepri.or.id</a></h1>
    </div>
  );
}

export default App;