
const TabelKolam = ({ items, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">No</th>
                        <th className="py-2 px-4 border-b">Nama</th>
                        <th className="py-2 px-4 border-b">Kedalaman</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b text-center">
                                {item.nama}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {item.tinggi} cm
                            </td>
                            <td className="py-2 px-4 border-b flex justify-center">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelKolam;
