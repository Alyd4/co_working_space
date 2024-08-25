import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoAtSharp } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import logo from "../assets/logo_sembangin.png";
import pin from "../assets/pin.png";
import pinvert from "../assets/pin_vert.png";
import notepaper from "../assets/note_papper_pin.png";
import penjepitbesar from "../assets/penjepit_besar.png";
import barzoom from "../assets/bar zoom.png";
import penghapus from "../assets/erarse.png";
import note from "../assets/note.png";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });

      if (response.status === 200) {
        const { isAdmin } = response.data;
    
        // Store the user information in localStorage
        localStorage.setItem('user', JSON.stringify({ email, isAdmin }));
    
        // Navigate based on the isAdmin flag
        if (isAdmin) {
            navigate('/Aadmin', { state: { email: email } });
        } else {
            navigate('/');
        }
    }
    
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Left Side */}
        <div className="p-10 md:w-1/2">
          <div className="mb-4">
            <img src={logo} alt="Sembang" className="w-16" />
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Masuk</h2>
          <p className="text-sm text-gray-600 mb-8">
            Pucuk ubi pucuk kangkung, banyak cakap pecah muncungs
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <IoAtSharp />
                </span>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ Karakter, 1 Huruf Besar"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Masuk
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <p className="mt-4 text-sm text-center text-gray-600">
            Belum mempunyai akun?{' '}
            <Link to="/daftar" className="text-blue-600 font-bold hover:underline">
              Daftar
            </Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="relative hidden md:flex md:w-1/2 bg-blue-500 text-center items-center justify-center p-10">
          <div className="text-center">
            <h3 className="text-white text-2xl font-bold mb-20 ml-20 w-[60%]">
              Temukan Ruang Kerja Terbaik untuk Komunitas Anda
            </h3>
          </div>
          {/* Gambar-gambar di posisi yang diinginkan */}
          <img src={pinvert} alt="image1" className="absolute top-0 right-0 max-w-[60%] max-h-[25%]" />
          <img src={pin} alt="image2" className="absolute top-10 left-0 max-w-[17%] max-h-[10%] m-2" />
          <img src={notepaper} alt="image3" className="absolute top-1/2 left-0 transform -translate-y-1/2 max-w-[45%] max-h-[55%] m-2" />
          <img src={note} alt="image4" className="absolute top-1/2 right-0 transform -translate-y-1/2 max-w-[60%] max-h-[60%] m-2" />
          <img src={penjepitbesar} alt="image5" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 max-w-[40%] max-h-[40%] m-2" />
          <img src={barzoom} alt="image6" className="absolute top-80 left-0 max-w-[50%] max-h-[40%] m-2" />
          <img src={penghapus} alt="image7" className="absolute bottom-0 right-0 max-w-[15%] max-h-[15%] m-2" />
        </div>
      </div>
    </div>
  );
};

export default Login;
