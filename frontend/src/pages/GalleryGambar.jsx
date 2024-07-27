import AdminNavbar from "../components/AdminNavbar";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const token = localStorage.getItem('token');

const GalleryGambar = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    useEffect(() => {
        // Fetch initial images from server
        fetchImages();

        // Listen for image added event
        socket.on("image_added", (data) => {
            setImages((prevImages) => [...prevImages, data.filename]);
        });

        // Listen for image deleted event
        socket.on("image_deleted", (deletedImage) => {
            setImages((prevImages) => prevImages.filter((image) => image !== deletedImage));
        });

        return () => {
            socket.off("image_added");
            socket.off("image_deleted");
        };
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get("http://localhost:5000/images");
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null); // Clear preview URL on cancel
    };

    const openDeleteModal = (filename) => {
        setImageToDelete(filename);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setImageToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
            });

            setSelectedFile(null);
            setPreviewUrl(null); // Clear preview after upload
            closeModal();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleDelete = async () => {
        if (!imageToDelete) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/delete/${imageToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setImages((prevImages) => prevImages.filter((image) => image !== imageToDelete));
            closeDeleteModal();

        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen w-full">
            <AdminNavbar />
            <main className="container mx-auto p-4 w-full max-w-screen-lg">
                <div className="flex">
                    <h1 className="text-2xl font-bold mb-4 flex-1">Galeri Gambar</h1>
                    <button
                        onClick={openModal}
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Add New Item
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((filename) => (
                        <div key={filename } className="relative">
                            <img
                                src={`http://localhost:5000/uploads/${filename}`}
                                alt={filename}
                                className="w-full h-auto object-cover"
                            />
                            <button
                                onClick={() => openDeleteModal(filename)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-2xl lg:max-w-4xl space-y-4 border bg-white p-12 rounded-lg">
                            <DialogTitle className="font-bold">Tambah Gambar</DialogTitle>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mb-4">
                                    <div
                                        className="flex items-center justify-center w-full"
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 px-4"
                                        >
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Image preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 20 16"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span> or drag and
                                                        drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG, JPeG
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${previewUrl === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`} disabled={previewUrl == null}
                                    >
                                        Upload
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
                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal} className="relative z-50">
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6 space-y-4">
                            <DialogTitle className="text-lg font-bold">Confirm Delete</DialogTitle>
                            <p>Are you sure you want to delete this image?</p>
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
            </main>
        </div>
    );
};

export default GalleryGambar;
