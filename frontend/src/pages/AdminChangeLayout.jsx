import AdminNavbar from "../components/AdminNavbar"
import axios from "axios"

const AdminChangeLayout = () => {
    const changeLayout = async (number) => {
        try {
            const response = await axios.get(`http://localhost:5000/admin/change-layout/${number}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error("Error changing layout:", error.response ? error.response.data : error.message);
        }
    };


    return (
        <>
            <AdminNavbar />
            <main className="p-4 flex justify-center">
                <div className=" overflow-hidden shadow-sm sm:rounded-lg p-8 w-full max-w-5xl">
                    <div className="flex space-x-8 mb-8 justify-center">
                        <button onClick={() => changeLayout(0)} className="bg-white p-6 rounded-lg text-gray-900 w-64 h-72 hover:shadow-lg">
                            <h2 className="text-lg font-bold mb-4 text-center">Layout 1</h2>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-3 h-4 bg-gray-200"></div>
                                <div className="col-span-2 h-16 bg-gray-200"></div>
                                <div className="col-span-1 h-16 bg-gray-200"></div>
                                <div className="col-span-1 h-16 bg-gray-200"></div>
                                <div className="col-span-2 h-16 bg-gray-200"></div>
                                <div className="col-span-3 h-4 bg-gray-200"></div>
                            </div>
                        </button>
                        <button onClick={() => changeLayout(1)} className="bg-white p-6 rounded-lg text-gray-900 w-64 h-72 hover:shadow-lg">
                            <h2 className="text-lg font-bold mb-4 text-center">Layout 2</h2>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-3 h-4 bg-gray-200"></div>
                                <div className="col-span-2 h-16 bg-gray-200"></div>
                                <div className="col-span-1 h-16 bg-gray-200"></div>
                                <div className="col-span-2 h-16 bg-gray-200"></div>
                                <div className="col-span-1 h-16 bg-gray-200"></div>
                                <div className="col-span-3 h-4 bg-gray-200"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default AdminChangeLayout