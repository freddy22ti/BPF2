import { useState, useEffect } from 'react'
import axios from 'axios'
import Marquee from "react-fast-marquee";

import InformasiUtama from "../components/InformasiUtama";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Loading from "../components/Loading";
import gambar1 from '../assets/gambar1.jpg'
import gambar2 from '../assets/gambar2.jpg'

const Layout2 = () => {
  const [dataUmum, setDataUmum] = useState(null);
  const [peraturan, setPeraturan] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/data/umum').then(res => {
      setDataUmum(res.data[0])
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    })

    axios.get('http://localhost:5000/api/v1/data/peraturan').then(res => {
      setPeraturan(res.data)
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    })
  }, [])

  if (!dataUmum || !peraturan) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen text-gray-900 bg-[#93c5fd]">
      <Header />
      <main className="p-4 grid grid-cols-6 grid-rows-5 gap-4">
        <div className="col-span-4 row-span-5">
          <div className="relative mx-auto">
            <div className="marquee-container overflow-hidden relative w-full h-[795px] bg-white rounded-lg shadow-lg p-4">
              <Marquee pauseOnHover gradient={false}>
                <img
                  src={gambar1}
                  className="flex-shrink-0 mx-2 rounded-lg"
                  style={{ width: 1050, height: 755 }}
                  alt="Gambar"
                />
                <img
                  src={gambar2}
                  className="flex-shrink-0 mx-2 rounded-lg"
                  style={{ width: 1050, height: 755 }}
                  alt="Gambar 2"
                />
              </Marquee>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-3 col-start-5">
          <InformasiUtama nama={dataUmum.nama} jadwalDanHarga={dataUmum.jadwalDanHarga} jamOperasional={dataUmum.jamOperasional} alamat={dataUmum.alamat} kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} />
        </div>
        <div className="col-span-2 row-span-2 col-start-5 row-start-4">
          <Card judul="patuhi peraturan!!!">
            <ul className="list-disc list-inside text-xl">
              {peraturan.map((aturan, index) => {
                return (
                  <li key={index}>{aturan.content}</li>
                )
              })}
            </ul>
          </Card>
        </div>

      </main>
      <Footer kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} />
    </div>
  )
};
export default Layout2;