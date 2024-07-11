import { useNavigate, Link, useLocation } from 'react-router-dom';


const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getLinkClassName = (path) => {
    return location.pathname === path
      ? "font-bold hover:text-gray-300 transition duration-150 ease-in-out"
      : "hover:text-gray-300 transition duration-150 ease-in-out";
  }

  return (
    <div className="bg-gray-800 flex items-center px-10">
      <nav className="border-b border-gray-100 dark:border-gray-700 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="hidden space-x-8 sm:ml-10 sm:flex text-white">
                <Link
                  to="/admin"
                  className={getLinkClassName('/admin')}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/layout"
                  className={getLinkClassName('/admin/layout')}
                >
                  Layout
                </Link>
                <Link
                  to="/admin/peraturan"
                  className={getLinkClassName('/admin/peraturan')}
                >
                  Peraturan
                </Link>
                <Link
                  to="/admin/informasi-kolam"
                  className={getLinkClassName('/admin/informasi-kolam')}
                >
                  Informasi Kolam
                </Link>
                <Link
                  to="/admin/sewa-barang"
                  className={getLinkClassName('/admin/sewa-barang')}
                >
                  Sewa Barang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
