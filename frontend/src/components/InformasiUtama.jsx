import { NumericFormat } from 'react-number-format';

const InformasiUtama = ({ nama, jadwalDanHarga, jamOperasional, alamat, kontak, sosialMedia, tinggiAnak, tinggiDewasa, informasiKolam, sewaBarang }) => {
  return (
    <>
      <div className='w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg shadow-md mb-8'>
        <h1 className='my-10 text-5xl font-bold text-center'>{nama}</h1>
        <div className="px-9 border-b-2 border-white py-3">

          <div className="grid grid-cols-2 gap-4">

            <div className='max-w-md flex justify-items-center flex-col'>
              {jadwalDanHarga.map((item, index) => (
                <h2 key={index} className='text-4xl mb-5 flex'>
                  <span className='font-bold w-64'>{item.waktu}</span>
                  <span className='flex-shrink-0'>:</span>
                  <span className='flex-grow text-right'>
                    Rp.<NumericFormat
                      value={item.harga}
                      allowLeadingZeros
                      thousandSeparator=","
                      displayType={'text'}
                      className='bg-transparent'
                    />
                  </span>
                </h2>
              ))}
            </div>

            <div className="flex">
              <div className='flex-grow text-end'>
                <div className='text-2xl mb-2 font-bold'>
                  Jam Operasional : {jamOperasional}
                </div>
                <div className='text-lg mb-5 mt-5'>
                  {alamat}
                </div>
              </div>

            </div>

          </div>

          <div className="flex space-x-8 justify-between my-4 font-bold">
            {informasiKolam.map((informasi) => (
              <div className="text-2xl" key={informasi.id}>
                <span className=''>
                  {informasi.nama}
                </span> : {informasi.tinggi} cm
              </div>
            ))}
          </div>

        </div>

        <div className="mt-8 px-9 grid grid-cols-2 gap-4">

          <div className="">
            {
              sewaBarang.map((barang) => {
                return (
                  <div key={barang.id} className="flex text-2xl mb-3">
                    <span className="w-64">{barang.nama}</span>
                    <span className="">: Rp.
                      <NumericFormat value={barang.harga} displayType={'text'} allowLeadingZeros thousandSeparator="," /></span>
                  </div>
                );
              })
            }
          </div>

          <div className="text-end text-2xl">
            <div className="mb-5">
              Dewasa : {tinggiAnak} cm
            </div>
            <div>
              Anak-Anak : {tinggiDewasa} cm
            </div>
          </div>
        </div>


      </div>
    </>
  )
}

export default InformasiUtama;