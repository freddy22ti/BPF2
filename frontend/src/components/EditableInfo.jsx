import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Loading from './Loading';

const socket = io('http://localhost:5000');

const EditableInfo = () => {
    const [formData, setFormData] = useState({
        nama: '',
        alamat: '',
        kontak: '',
        sosialMedia: '',
        jadwalDanHarga: [],
        jamOperasional: '',
        tinggiAnak: '',
        tinggiDewasa: '',
    });
    const [originalData, setOriginalData] = useState(formData);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/data/umum')
            .then(res => {
                setFormData(res.data[0]);
                setOriginalData(res.data[0]);
            })
            .catch(err => {
                console.log('Error fetching initial data:', err);
            });
    }, []);

    useEffect(() => {
        socket.on('general_info_updated', (updatedInfo) => {
            setFormData(updatedInfo);
        });
    }, []);

    useEffect(() => {
        setIsChanged(JSON.stringify(formData) !== JSON.stringify(originalData));
    }, [formData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNestedChange = (e, index, field) => {
        const newJadwalDanHarga = formData.jadwalDanHarga.map((item, i) => (
            i === index ? { ...item, [field]: e.target.value } : item
        ));
        setFormData({
            ...formData,
            jadwalDanHarga: newJadwalDanHarga,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/admin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('General info saved successfully');
            } else {
                console.error('Failed to save general info');
            }
        } catch (error) {
            console.error('Error saving general info:', error);
        }
        setOriginalData(formData);
        setIsChanged(false);
    };

    if (!formData) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Nama Tempat</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Alamat</label>
                            <input
                                type="text"
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Kontak</label>
                            <input
                                type="text"
                                name="kontak"
                                value={formData.kontak}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Sosial Media</label>
                            <input
                                type="text"
                                name="sosialMedia"
                                value={formData.sosialMedia}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Jam Operasional</label>
                            <input
                                type="text"
                                name="jamOperasional"
                                value={formData.jamOperasional}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Tinggi Anak</label>
                            <input
                                type="text"
                                name="tinggiAnak"
                                value={formData.tinggiAnak}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Tinggi Dewasa</label>
                            <input
                                type="text"
                                name="tinggiDewasa"
                                value={formData.tinggiDewasa}
                                onChange={handleChange}
                                className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-bold text-lg block">Jadwal dan Harga</label>
                            {formData.jadwalDanHarga.map((item, index) => (
                                <div key={index} className="mt-2">
                                    <div>{item.waktu}</div>
                                    <input
                                        type="text"
                                        value={item.harga}
                                        onChange={(e) => handleNestedChange(e, index, 'harga')}
                                        placeholder="Harga"
                                        className="mt-1 text-xl block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded py-2 px-3 mb-5"
                                    />
                                </div>
                            ))}
                        </div>
                        <hr className="my-6 border-gray-300 dark:border-gray-600" />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isChanged}
                                className={`py-2 px-4 rounded shadow transition-all ${isChanged ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400'
                                    } text-white`}
                            >
                                Save Data
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditableInfo;
