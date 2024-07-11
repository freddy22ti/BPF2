import AdminNavbar from "../components/AdminNavbar";
import io from 'socket.io-client';
import axios from "axios";
import { useState, useEffect } from "react";
import TabelKolam from "../components/InformasiKolam/TabelKolam";
import KolamForm from "../components/InformasiKolam/KolamForm";

const url = 'http://localhost:5000/admin/kolam';
const socket = io('http://localhost:5000');

const InformasiKolam = () => {
    const [items, setItems] = useState([]);
    const [itemToEdit, setItemToEdit] = useState({ nama: '', tinggi: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        socket.on('kolam_updated', (updatedItem) => {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                )
            );
        });

        fetchItems();

        return () => {
            socket.off('kolam_updated');
        };
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async (item) => {
        try {
            const response = await axios.post(url, item, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems([...items, response.data]);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateItem = async (item) => {
        try {
            await axios.put(`${url}/${item.id}`, item, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(items.map((i) => (i.id === item.id ? item : i)));
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${url}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleFormSubmit = (item) => {
        if (item.id) {
            updateItem(item);
        } else {
            addItem(item);
        }
        setIsModalOpen(false);
    };

    const handleEdit = (item) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const openModal = () => {
        setItemToEdit({ nama: "", tinggi: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <AdminNavbar />
            <div className="container mx-auto p-4">
                <div className='flex'>
                    <h1 className="text-2xl font-bold mb-4 flex-1">Informasi Kolam</h1>
                    <button
                        onClick={openModal}
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Add New Item
                    </button>
                </div>
                <TabelKolam items={items} onEdit={handleEdit} onDelete={deleteItem} />
                <KolamForm
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    onSubmit={handleFormSubmit}
                    itemToEdit={itemToEdit}
                />
            </div>
        </>
    );
}

export default InformasiKolam;
