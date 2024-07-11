import axios from 'axios';
import io from 'socket.io-client';
import Marquee from "react-fast-marquee";
import { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Loading from "../components/Loading";
import InformasiUtama from "../components/InformasiUtama";

import gambar1 from '../assets/gambar1.jpg';
import gambar2 from '../assets/gambar2.jpg';

const socket = io('http://localhost:5000');

const Layout1 = () => {
  const [dataUmum, setDataUmum] = useState(null);
  const [peraturan, setPeraturan] = useState([]);
  const [informasiKolam, setInformasiKolam] = useState([]);
  const [sewaBarang, setSewaBarang] = useState([]);

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
  }, []);

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

  }, []);

  if (!dataUmum || !peraturan || !informasiKolam || !sewaBarang) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full min-h-screen text-gray-900 bg-[#93c5fd]">
        <Header />
        <div className="p-4 grid grid-cols-6 grid-rows-2 gap-x-4 gap-y-2">
          <div className="col-span-4 row-span-2">
            <InformasiUtama nama={dataUmum.nama} jadwalDanHarga={dataUmum.jadwalDanHarga} jamOperasional={dataUmum.jamOperasional} alamat={dataUmum.alamat} kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} tinggiAnak={dataUmum.tinggiAnak} tinggiDewasa={dataUmum.tinggiDewasa} />
          </div>
          <div className="col-span-2 row-span-2 col-start-5">
            <div className="h-full marquee-container overflow-hidden relative w-full h-[475px] bg-white rounded-lg shadow-lg p-4">
              <Marquee pauseOnHover gradient={false}>
                <img
                  src={gambar1}
                  className="flex-shrink-0 mx-2 rounded-lg"
                  style={{ width: 470, height: 440 }}
                  alt="Gambar"
                />
                <img
                  src={gambar2}
                  className="flex-shrink-0 mx-2 rounded-lg"
                  style={{ width: 470, height: 440 }}
                  alt="Gambar 2"
                />
              </Marquee>
            </div>
          </div>
          <div className="col-span-2 row-span-2 row-start-4">
            <Card judul="Informasi Kolam">
              {
                informasiKolam.map((informasi) => {
                  return (
                    <p className="text-xl py-2" key={informasi.id}>{informasi.nama} : {informasi.tinggi} cm</p>
                  );
                })
              }
            </Card>
          </div>
          <div className="col-span-2 row-span-2 row-start-4">
            <Card judul="patuhi peraturan!!!">
              <ul className="list-disc list-inside text-xl">
                {peraturan.map((aturan) => {
                  return (
                    <li key={aturan.id}>{aturan.content}</li>
                  );
                })}
              </ul>
            </Card>
          </div>
          <div className="col-span-2 row-span-2 row-start-4">
            <Card judul="sewa barang">
              {
                sewaBarang.map((barang) => {
                  return (
                    <div key={barang.id} className="grid grid-cols-3 text-xl mb-3">
                      <span className="">{barang.nama}</span>
                      <span className="col-span-2">: Rp.
                        <NumericFormat value={barang.harga} displayType={'text'} allowLeadingZeros thousandSeparator="," /></span>
                    </div>
                  );
                })
              }
            </Card>
          </div>
        </div>
        <Footer kontak={dataUmum.kontak} sosialMedia={dataUmum.sosialMedia} />
      </div>
    </>
  );
};

export default Layout1;
