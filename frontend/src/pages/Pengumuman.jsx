import AdminNavbar from "../components/AdminNavbar";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const token = localStorage.getItem('token');

const Pengumuman = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState({ tanggal: '', deskripsi: '' });
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        fetchEvents();

        socket.on("event_updated", (updatedEvent) => {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );
        });

        socket.on("event_deleted", (deletedEventId) => {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== deletedEventId)
            );
        });

        return () => {
            socket.off("event_updated");
            socket.off("event_deleted");
        };
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/admin/events", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const openModal = () => {
        setCurrentEvent({ tanggal: '', deskripsi: '' });
        setSelectedEventId(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (event) => {
        setCurrentEvent({ tanggal: event.tanggal, deskripsi: event.deskripsi });
        setSelectedEventId(event.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openDeleteModal = (eventId) => {
        setSelectedEventId(eventId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (selectedEventId) {
                response = await axios.put(`http://localhost:5000/admin/events/${selectedEventId}`, currentEvent, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === selectedEventId ? response.data : event
                    )
                );
            } else {
                response = await axios.post("http://localhost:5000/admin/events", currentEvent, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents((prevEvents) => [...prevEvents, response.data]);
            }
            closeModal();
        } catch (error) {
            console.error("Failed to submit event:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/admin/events/${selectedEventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    return (
        <>
            <AdminNavbar />
            <main className="container mx-auto p-4">
                <div className='flex'>
                    <h1 className="text-2xl font-bold mb-4 flex-1">Pengumuman</h1>
                    <button
                        onClick={openModal}
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    >
                        + Add New
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Tanggal</th>
                                <th className="py-2">Deskripsi</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td className="border px-4 py-2">{event.tanggal}</td>
                                    <td className="border px-4 py-2">{event.deskripsi}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => openModalForEdit(event)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(event.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-2xl space-y-4 border bg-white p-12 rounded-lg">
                        <DialogTitle className="font-bold">{selectedEventId ? "Edit Pengumuman" : "Tambah Pengumuman"}</DialogTitle>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tanggal</label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    id="date"
                                    value={currentEvent.tanggal}
                                    onChange={handleEventChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    name="deskripsi"
                                    id="description"
                                    value={currentEvent.deskripsi}
                                    onChange={handleEventChange}
                                    className="p-4 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${currentEvent.tanggal === '' || currentEvent.deskripsi === '' ?  'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`} disabled={currentEvent.tanggal === '' || currentEvent.deskripsi === ''}
                                >
                                    {selectedEventId ? "Update" : "Submit"}
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

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4">
                        <DialogTitle className="text-lg font-bold">Confirm Delete</DialogTitle>
                        <p>Are you sure you want to delete this announcement?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default Pengumuman;
