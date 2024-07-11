import AdminNavbar from "../components/AdminNavbar"
import EditableInfo from "../components/EditableInfo"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen w-full">
      <AdminNavbar />
      <main>
        <EditableInfo />
      </main>
    </div>
  )
}

export default AdminDashboard