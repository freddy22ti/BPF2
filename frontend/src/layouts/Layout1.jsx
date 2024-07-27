import axios from 'axios';
import io from 'socket.io-client';
import Marquee from "react-fast-marquee";
import { useState, useEffect } from 'react';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Loading from "../components/Loading";
import InformasiUtama from "../components/InformasiUtama";

const socket = io('http://localhost:5000');

const Layout1 = () => {
  const [dataUmum, setDataUmum] = useState(null);
  const [peraturan, setPeraturan] = useState([]);
  const [informasiKolam, setInformasiKolam] = useState([]);
  const [sewaBarang, setSewaBarang] = useState([]);
  const [gambar, setGambar] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);

  // fetch data
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/data/umum').then(res => {
      setDataUmum(res.data[0]);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });

    axios.get('http://localhost:5000/api/v1/data/peraturan').then(res => {
      setPeraturan(res.data);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });

    axios.get('http://localhost:5000/api/v1/data/kolam').then(res => {
      setInformasiKolam(res.data);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });

    axios.get('http://localhost:5000/api/v1/data/sewa-barang').then(res => {
      setSewaBarang(res.data);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });

    axios.get('http://localhost:5000/images').then(res => {
      setGambar(res.data);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });

    axios.get('http://localhost:5000/api/v1/data/events').then(res => {
      setPengumuman(res.data);
    }).catch(err => {
      console.log('Error fetching initial data:', err);
    });
  }, []);

  // update data using socket io
  useEffect(() => {
    const updateData = (setState, newItem) => {
      setState(prevState => {
        const exists = prevState.some(item => item.id === newItem.id);
        return exists ? prevState.map(item => item.id === newItem.id ? newItem : item) : [...prevState, newItem];
      });
    };

    socket.on('general_info_updated', (updatedInfo) => {
      setDataUmum(updatedInfo);
    });

    socket.on('sewa_barang_updated', (barangUpdated) => {
      updateData(setSewaBarang, barangUpdated);
    });

    socket.on('sewa_barang_deleted', (id) => {
      setSewaBarang(prevSewaBarang => prevSewaBarang.filter(sewaBarang => sewaBarang.id !== id));
    });

    socket.on('peraturan_updated', (peraturanUpdated) => {
      updateData(setPeraturan, peraturanUpdated);
    });

    socket.on('peraturan_deleted', (id) => {
      setPeraturan(prevPeraturan => prevPeraturan.filter(peraturan => peraturan.id !== id));
    });

    socket.on('kolam_updated', (kolamUpdated) => {
      updateData(setInformasiKolam, kolamUpdated);
    });

    socket.on('kolam_deleted', (id) => {
      setInformasiKolam(prevInformasiKolam => prevInformasiKolam.filter(informasiKolam => informasiKolam.id !== id));
    });

    socket.on('image_added', (data) => {
      updateData(setGambar, data.filename);
    });

    socket.on('image_deleted', (deletedImage) => {
      setGambar((prevGambar) => prevGambar.filter((image) => image !== deletedImage));
    });

    socket.on('event_updated', (eventUpdated) => {
      updateData(setPengumuman, eventUpdated);
    });
    socket.on('event_deleted', (deletedEvent) => {
      setPengumuman((prev) => prev.filter((curr) => curr !== deletedEvent));
    });

    return () => {
      socket.off('general_info_updated');
      socket.off('sewa_barang_updated');
      socket.off('sewa_barang_deleted');
      socket.off('peraturan_updated');
      socket.off('peraturan_deleted');
      socket.off('kolam_updated');
      socket.off('kolam_deleted');

      socket.off('image_added');
      socket.off('image_deleted');
      socket.off('event_updated');
      socket.off('event_deleted');
    };

  }, []);

  if (!dataUmum || !peraturan || !informasiKolam || !sewaBarang || !gambar || !pengumuman) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full min-h-screen text-gray-900 bg-[#93c5fd]">
        <Header />
        <div className="p-4 grid grid-cols-6 grid-rows-2 gap-x-4 gap-y-2">
          <div className="col-span-4 row-span-2">
            <InformasiUtama nama={dataUmum.nama} jadwalDanHarga={dataUmum.jadwalDanHarga} jamOperasional={dataUmum.jamOperasional} alamat={dataUmum.alamat} kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} tinggiAnak={dataUmum.tinggiAnak} tinggiDewasa={dataUmum.tinggiDewasa} informasiKolam={informasiKolam} sewaBarang={sewaBarang} />
          </div>

          {/* Gambar */}
          <div className="col-span-12 row-span-5 col-start-5">
            <div className="h-full marquee-container overflow-hidden relative w-full bg-white rounded-lg shadow-lg p-4">
              <Marquee gradient={false}>
                {gambar.map((name, index) => (
                  <img
                    key={index}
                    src={'http://localhost:5000/uploads/' + name}
                    className="flex-shrink-0 mx-2 rounded-lg"
                    alt={name}
                    style={{ height: 800 }}
                  />
                ))}

              </Marquee>
            </div>
          </div>

          {/* Pengumuman */}
          <div className="col-span-2 row-span-2 row-start-4">
            <Card judul="Pengumuman">
              <ol className="list-decimal list-inside text-xl">
                {
                  pengumuman.map((item) => {
                    return (
                      <li key={item.id} className='mb-2'>
                        <span className="w-64 font-bold">
                          {item.tanggal}
                        </span> 
                        <span>
                          : {item.deskripsi}
                        </span>
                      </li>
                    );
                  })
                }
              </ol>
            </Card>
          </div>

          {/* Peraturan */}
          <div className="col-span-2 row-span-2 row-start-4">
            <Card judul="patuhi peraturan!!!">
              <ol className="list-decimal list-inside text-xl">
                {peraturan.map((aturan) => {
                  return (
                    <li key={aturan.id} className='mb-2'>{aturan.content}</li>
                  );
                })}
              </ol>
            </Card>
          </div>


        </div>
        <Footer kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} />
      </div>
    </>
  );
};

export default Layout1;
