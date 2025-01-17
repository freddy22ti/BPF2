import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';


const KolamForm = ({ isOpen, closeModal, onSubmit, itemToEdit }) => {
    const [nama, setNama] = useState('');
    const [tinggi, setTinggi] = useState(0);

    useEffect(() => {
        if (itemToEdit) {
            setNama(itemToEdit.nama);
            setTinggi(itemToEdit.tinggi);
        } else {
            setNama('');
            setTinggi('');
        }
    }, [itemToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nama, tinggi, id: itemToEdit ? itemToEdit.id : null });
        closeModal();
    };

    return (
        <Dialog open={isOpen} onClose={closeModal}
            className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-lg">
                    <DialogTitle className="font-bold">{itemToEdit.nama != '' ? 'Edit' : 'Tambah'} Kolam</DialogTitle>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                                Nama Kolam
                            </label>
                            <input
                                type='text'
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tinggi">
                                Kedalaman Kolam
                            </label>
                            <NumericFormat
                                id="tinggi"
                                value={tinggi}
                                onChange={(e) => setTinggi(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                allowLeadingZeros thousandSeparator=","
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            >
                                {itemToEdit.nama != '' ? 'Update' : 'Add'} Kolam
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default KolamForm;
