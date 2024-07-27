import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminChangeLayout from "./pages/AdminChangeLayout";
import Peraturan from "./pages/Peraturan";
import SewaBarang from "./pages/SewaBarang";
import InformasiKolam from "./pages/InformasiKolam";
import { Auth, Logout } from './Auth';
import './index.css'
import GalleryGambar from "./pages/GalleryGambar";
import Pengumuman from "./pages/Pengumuman";

function MyApp() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={
            <>
              <Auth />
              <AdminDashboard />
            </>
          } />
          <Route path='/admin/layout' element={
            <>
              <Auth />
              <AdminChangeLayout />
            </>
          } />
          <Route path='/admin/peraturan' element={
            <>
              <Auth />
              <Peraturan />
            </>
          } />
          <Route path='/admin/sewa-barang' element={
            <>
              <Auth />
              <SewaBarang />
            </>
          } />
          <Route path='/admin/informasi-kolam' element={
            <>
              <Auth />
              <InformasiKolam />
            </>
          } />
          <Route path='/admin/gambar' element={
            <>
              <Auth />
              <GalleryGambar />
            </>
          } />
          <Route path='/admin/events' element={
            <>
              <Auth />
              <Pengumuman />
            </>
          } />
          <Route path="/logout" element={<Logout />} />
          <Route path='*' element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default MyApp
