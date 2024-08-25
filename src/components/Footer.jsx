import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youtube.png";


// const socialmedia = [
//   {
//   img: facebook
// },
// {
//   img: instagram
// },
// {
//   img: youtube
// }
// ]
const Footer = () => {
  return (
    <footer className="bg-white py-6 text-center px-12">
      <div className="container mx-auto flex justify-between items-center">
        <div className="mb-4">
          <span className="text-xl font-bold text-blue-600">Co-Working Space</span>
        </div>
        <div className="mb-4 flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600 font-semibold">Beranda</a>
          <a href="/Product" className="text-gray-700 hover:text-blue-600 font-semibold">Produk</a>
          <a href="/Layanan" className="text-gray-700 hover:text-blue-600 font-semibold">Layanan</a>
          <a href="/Tentang" className="text-gray-700 hover:text-blue-600 font-semibold">Tentang</a>
          <a href="/Kontak" className="text-gray-700 hover:text-blue-600 font-semibold">Kontak</a>
        </div>
        <div className="mb-6 flex space-x-4">
          <a href="https://facebook.com" className="text-gray-700 hover:text-blue-600 w-6"><img src={facebook} alt="" /></a>
          <a href="https://instagram.com" className="text-gray-700 hover:text-blue-600 w-6"><img src={instagram} alt="" /></a>
          <a href="https://youtube.com" className="text-gray-700 hover:text-blue-600 w-6"><img src={youtube} alt="" /></a>

        </div>
      </div>
      <div className=" pt-4 text-center">
        <p className="text-sm text-gray-600">©2024 Sembangin Metawork</p>
      </div>
    </footer>
  );
};

export default Footer;
