import { NumericFormat } from 'react-number-format';

const TabelBarang = ({ items, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Nama</th>
                        <th className="py-2 px-4 border-b">Harga</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.nama + item.harga}>
                            <td className="py-2 px-4 border-b text-center">{item.nama}</td>
                            <td className="py-2 px-4 border-b text-center">
                                Rp.<NumericFormat value={item.harga} displayType={'text'} allowLeadingZeros thousandSeparator="," />
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

export default TabelBarang;
