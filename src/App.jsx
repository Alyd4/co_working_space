import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
import Home from "./pages/Home"; 
import Category from "./pages/AboutUs";
import Login from "./pages/Login";
import Product from "./components/Product";
import Footer from "./components/Footer";
import Fitur1 from "./pages/Fitur1";
import AboutUs from "./pages/AboutUs";
import Tentang from "./components/Tentang";
import Kontak from "./components/Kontak";
import Invoice from "./components/Invoice"
import Contact from "./pages/Contact";
import Daftar from "./pages/Daftar";
import Layanan from "./components/Layanan";
import Fitur2 from "./pages/Fitur2";
import Admin from "./components/Admin";
import Admin2 from "./components/Admin2";
import Aadmin from "./pages/Aadmin";



export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
      {/* <Header/> */}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Product" element={<Fitur1 />}/>
        <Route path="/Layanan" element={<Fitur2 />}/>
        <Route path="/Tentang" element={<AboutUs />}/>
        <Route path="/Kontak" element={<Contact />}/>
        <Route path="/Product" element={<Fitur1  />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/login" element={<Login />}/> 
        <Route path="/daftar" element={<Daftar />}/>
        <Route path="/invoice" element={<Invoice />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/admin2" element={<Admin2 />}/>
        <Route path="/aadmin" element={<Aadmin />}/>
      </Routes>
      </BrowserRouter>
    </main>
  )
}