import React, { useState, useRef } from 'react';

import emailjs from '@emailjs/browser';
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youtube.png";
import { Alert } from "@material-tailwind/react";
 


export default function Contact() {

  const [alert, setAlert] = useState(false);
  const form = useRef();



  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic, such as sending the data to a server
   
    emailjs
    .sendForm('service_dsfawyb', 'template_9tg3d2c', form.current, {
      publicKey: 'KGHStOXyQ5a8AzRrH',
    })
    .then(
      (result) => {
        setAlert(true); // Show the alert
          setTimeout(() => setAlert(false), 3000); // Hide the alert after 3 seconds
          console.log(result.text);
      },
      (error) => {
        console.log('FAILED...', error.text);
      },
    );
    
  };

  return (
    <div className="bg-white py-8 px-4 m-7">
      <header className="text-center mb-20">
        <div className='flex justify-center'>
        <h1 className="text-3xl text-blue-600 font-bold mt-20 w-[40%]">
          Jika anda ingin tahu lebih banyak silahkan hubungi kami
        </h1>
        </div>
      </header>
             {/* Alert Notification */}
             {alert && (
       <Alert color="green" className="mb-4 w-[50%] ml-auto flex">
       Email berhasil terkirim!
     </Alert>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-bold mb-4">Kontak Kami</h2>
          <p className="text-gray-700 mb-4">
            Jika ada kendala dalam pemrosesan, ataupun ingin bermitra lebih jauh
          </p>
          <p className="text-gray-900 font-semibold">Address</p>
          <p className="text-gray-700 mb-4">
            Jalan Kaka Tua II, Desa Toapaya Selatan, RT/ RW 001/001, Kec. Toapaya, Kabupaten Bintan, Kepulauan Riau, Indonesia
          </p>
          <p className="text-gray-900 font-semibold">Phone Number</p>
          <p className="text-gray-700 mb-4">+62 823-8814-9914</p>
          <p className="text-gray-900 font-semibold">E-Mail</p>
          <p className="text-gray-700 mb-4">pkbikepri@pkbi.or.id</p>
          <p className="text-gray-900 font-semibold">Lebih tentang kami:</p>
          <div className="flex space-x-4 text-2xl mt-2">
            <a href="https://facebook.com" className=" w-6" aria-label="Facebook">
            <img src={facebook} alt="" />
            </a>
            <a href="https://instagram.com" className="text-pink-600 w-6" aria-label="Instagram">
            <img src={instagram} alt="" />
            </a>
            <a href="https://youtube.com" className=" w-6" aria-label="YouTube">
            <img src={youtube} alt="" />
            </a>
          </div>
        </div>

   

        {/* Send Message Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">Kirim pesan</h2>
          <form ref={form}  onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="user_name" className="block text-gray-700 mb-2">Nama:</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
              
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="user_mail" className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                id="user_mail"
                name="user_mail"
             
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 mb-2">Pesan:</label>
              <textarea
                id="message"
                name="message"
   
                className="w-full border rounded px-3 py-2"
                rows="4"
                required
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
              Kirim
            </button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Maps</h2>
        <div className="w-full h-64 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2523456936487!2d104.51888577447296!3d0.9650830626928303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d96d89d01bab3d%3A0xbafe9cab8f8fc51b!2sKantor%20PKBI%20Daerah%20Kepulauan%20Riau!5e0!3m2!1sid!2sid!4v1723367909637!5m2!1sid!2sid"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            className="w-full h-full"
            title="Google Maps"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
