import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fitur1 from "./pages/Fitur1";
import Fitur2 from "./pages/Fitur2";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Daftar from "./pages/Daftar";
import Invoice from "./components/Invoice";
import Admin from "./components/Admin";
import Admin2 from "./components/Admin2";
import Aadmin from "./pages/Aadmin";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user details
  const isAdmin = user?.isAdmin; // Check if the user is an admin

  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Product" element={<Fitur1 />} />
          <Route path="/Layanan" element={<Fitur2 />} />
          <Route path="/Tentang" element={<AboutUs />} />
          <Route path="/Kontak" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/invoice" element={<Invoice />} />

          {/* Private Routes for Admin */}
          <Route element={<PrivateRoute isAdmin={isAdmin} />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin2" element={<Admin2 />} />
            <Route path="/aadmin" element={<Aadmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}
