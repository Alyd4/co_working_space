import React, { useState } from 'react';

import logo from "../assets/logo_sembangin.png";
import { NavLink,Link, useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import pin from "../assets/pin.png";
import note from "../assets/note_papper_pin.png";
import bar from "../assets/bar zoom.png"
import erase from '../assets/erarse.png';
import jepitkecil from "../assets/penjepit kecil.png";
import jepitbesar from "../assets/penjepit_besar.png";
import pin2 from "../assets/pin_vert.png";
import pena from "../assets/pena.png"
import note2 from "../assets/note.png";
import cursor from "../assets/cursor.png";
import card from "../assets/Business Card and a Clip.png"

function Hero() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Inisialisasi history untuk navigasi
  const handleSearch = () => {
    const queryLowerCase = query.toLowerCase(); // Convert the query to lowercase
  
    // Define keyword-to-path mappings
    const keywordMappings = {
      produk: '/Product',
      product : '/Product',
      layanan: '/Layanan',
      website : '/Product',
      pricing: '/', // Example for an additional keyword
      // Add more mappings as needed
    };
  
    // Iterate over the mappings to find a match
    for (const [keyword, path] of Object.entries(keywordMappings)) {
      if (queryLowerCase.includes(keyword)) {
        navigate(path); // Navigate to the matched path
        return;
      }
    }
  
    // Navigate to the home page if no keyword matches
    navigate('/');
  };
  
  return (
    <section className="relative bg-white h-screen flex flex-col justify-center items-center text-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white to-gray-100 -z-10" />

      {/* Floating Stationery Assets */}
      <img
        src={bar} 
        alt="bar zoom"
        className="absolute left-0 w-[12%]"
      />
      <img
        src={note}
        alt="Note Papper Pin"
        className="absolute bottom-3 left-0 w-[12%]"
      />
      <img
        src={pin}
        alt="pin"
        className="absolute top-[20%] left-20 w-20"
      />
      <img
        src={note2}
        alt="note"
        className="absolute bottom-[24%] right-0 w-[12%]"
      />
      <img
        src={pena}
        alt="pena"
        className="absolute bottom-0 left-[21%] w-20"
      />
      <img
        src={pin2}
        alt="papper clip"
        className="absolute bottom-20 right-[12%] w-[6%]"
      />
      <img
        src={jepitbesar}
        alt="penjepit besar"
        className="absolute top-[85%] left-20 w-[12%]"
      />
      <img
        src={jepitkecil}
        alt="penjepit kecil"
        className="absolute top-[50%] left-[20%] w-[7%]"
      />
      <img
        src={erase}
        alt="penghapus"
        className="absolute bottom-[7%] left-[90%] w-20"
      />
      <img
        src={cursor}
        alt="cursor"
        className="absolute bottom-[-5%] left-[60%] w-[10%]"
      />
      <img
        src={card}
        alt="card"
        className="absolute bottom-[-7%] left-[38%] w-[20%]"
      />
      {/* Add other assets similarly... */}

       {/* Logo */}
       <img
        src={logo} // Replace with your logo path 
        className="mb-4 w-40" // Adjust the width and margin as needed
      />
      
      {/* Header Text */}
      <h1 className="text-4xl font-bold text-blue-600">
        Temukan Ruang Kerja Terbaik <br /> untuk Komunitas Anda
      </h1>

      {/* Search Bar */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for specific features " 
          className="border border-gray-300 rounded-full py-3 px-5 w-96"
        />
        <button 
        onClick={handleSearch}
        className=" bg-black text-white py-3.5 px-10 rounded-full hover:bg-blue-600 text-xs flex h-12">

          Mulai Sekarang <FaArrowRight className="mt-1 ml-1" />
        </button>
      </div>
    </section>
    // <section className='relative bg-home bg-center bg-no-repeat h-screen w-full'>
    //   <div>
    //    <Link><img src={logo} alt="" height={66} width={88}/></Link>
    //    </div>
    //   <div className='max_padd_container relative top-32 xs:top-52'>
    //     <h1 className='text-[48px] Leading-tight md:text-[72px] md:Leading-[1.3]
    //     mb-8 font-bold capitalize max-w-[32rem] '>Temukan Ruang Kerja Terbaik untuk Komunitas Anda</h1>
    //     <div className='max-xs:flex-col flex-initial w-64'>
    //       <NavLink to={''} className={"medium-15 border border-green-90 bg-transparent px-7 py-3 text-green-90 transition-all hover:bg-black hover:text-white rounded-full flexCenter"}>Cari fitur yang spesifik <FiSearch className='text-2xl' /></NavLink>
    //       <NavLink to={''} className={"medium-15 border bg-blue-600 px-7 py-3 text-white transition-all rounded-full flexCenter gap-x-2 medium-16"}>Mulai Sekarang <FaArrowRight /></NavLink>
    //     </div>
    //   </div>
    // </section>
  )
}

export default Hero