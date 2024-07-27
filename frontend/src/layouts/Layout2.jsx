import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import axios from 'axios'
import Marquee from "react-fast-marquee";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { NumericFormat } from 'react-number-format';
import Slider from '../components/Slider';

const socket = io('http://localhost:5000');

const Layout2 = () => {
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
    <div className="min-h-screen text-gray-900 bg-[#93c5fd] flex flex-col">
  <Header />
  <main className="flex-grow grid grid-cols-10 gap-4 p-4">
    {/* Image Section */}
    <div className="col-span-7 overflow-hidden flex justify-center items-center">
      <div className="relative w-full h-full bg-white rounded-lg shadow-lg p-4 flex items-center">
        <div className="marquee-container w-full">
          <Marquee gradient={false}>
            {gambar.map((name, index) => (
              <img
                key={index}
                src={'http://localhost:5000/uploads/' + name}
                className="flex-shrink-0 mx-2 rounded-lg"
                alt={name}
                style={{ height: '80vh' }} // Adjust height as needed
              />
            ))}
          </Marquee>
        </div>
      </div>
    </div>

    {/* Right Column: General Information and Slider */}
    <div className="col-span-3 flex flex-col justify-between h-full">
      {/* General Information */}
      <div className=" bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md mb-4">
        <h1 className="my-10 text-5xl font-bold text-center">{dataUmum.nama}</h1>
        <div className="px-9 border-b-2 border-white py-3">
          <div className="max-w-md flex flex-col">
            {dataUmum.jadwalDanHarga.map((item, index) => (
              <h2 key={index} className="text-3xl mb-5 flex">
                <span className="font-bold w-64">{item.waktu}</span>
                <span className="flex-shrink-0">:</span>
                <span className="flex-grow text-right">
                  Rp.<NumericFormat
                    value={item.harga}
                    allowLeadingZeros
                    thousandSeparator=","
                    displayType={'text'}
                    className="bg-transparent"
                  />
                </span>
              </h2>
            ))}
          </div>

          <div className="flex mt-4">
            <div className="flex-grow">
              <div className="text-2xl mb-2 font-bold">
                Jam Operasional: {dataUmum.jamOperasional}
              </div>
              <div className="text-lg mb-5 mt-5">
                {dataUmum.alamat}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-9 text-2xl mb-8">
          <div className="mb-5 flex">
            <span className="w-36">
              Dewasa
            </span>
            <span>
              : {dataUmum.tinggiDewasa} cm
            </span>
          </div>
          <div className="flex">
            <span className="w-36">
              Anak-Anak
            </span>
            <span>
              : {dataUmum.tinggiAnak} cm
            </span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="flex-grow">
        <Slider>
          <Card judul="Patuhi Peraturan!!!">
            <ul className="list-decimal list-inside text-xl">
              {peraturan.map((aturan, index) => (
                <li key={index} className="mb-1">{aturan.content}</li>
              ))}
            </ul>
          </Card>
          <Card judul="Sewa Barang">
            {sewaBarang.map((barang) => (
              <div key={barang.id} className="flex text-xl mb-1">
                <span className="w-64">{barang.nama}</span>
                <span>: Rp.
                  <NumericFormat value={barang.harga} displayType={'text'} allowLeadingZeros thousandSeparator="," />
                </span>
              </div>
            ))}
          </Card>
          <Card judul="Pengumuman">
            <ol className="list-decimal list-inside text-xl">
              {pengumuman.map((item) => (
                <li key={item.id} className="mb-1">
                  <span className="w-64 font-bold">{item.tanggal}</span>
                  <span>: {item.deskripsi}</span>
                </li>
              ))}
            </ol>
          </Card>
        </Slider>
      </div>
    </div>
  </main>
  <Footer kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} />
</div>

  )
};

export default Layout2;
