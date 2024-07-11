import { NumericFormat } from 'react-number-format';

const InformasiUtama = ({ nama, jadwalDanHarga, jamOperasional, alamat, kontak, sosialMedia, tinggiAnak, tinggiDewasa }) => {
  return (
    <>
      <div className='w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg shadow-md mb-8'>
        <h1 className='my-10 text-5xl font-bold text-center'>{nama}</h1>
        <div className="px-9 border-b-2 border-white py-3 flex flex-col justify-center items-center">
          {jadwalDanHarga.map((item, index) => {
            return (
              <h2 key={index} className='text-4xl mb-5'>
                {item.waktu} :
                Rp.<NumericFormat value={item.harga} allowLeadingZeros thousandSeparator="," displayType={'text'} className='bg-transparent' />

              </h2>
            )
          })}
        </div>

        <div className="flex mt-6">
          <div className='px-9 flex-grow'>
            <div className='text-2xl mb-2'>
              Jam Operasional : {jamOperasional}
            </div>
            <div className='text-md mb-5 mt-5'>
              {alamat}
            </div>
          </div>
          {tinggiAnak && tinggiDewasa ? (
            <div className="text-end px-9 text-2xl">
              <div className="mb-5">
                Dewasa : {tinggiAnak} cm
              </div>
              <div>
                Anak-Anak : {tinggiDewasa} cm
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </>
  )
}

export default InformasiUtama;