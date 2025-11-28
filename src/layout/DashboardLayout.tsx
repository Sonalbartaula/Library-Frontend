
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/footer";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
        <Footer />
      </div>
      
    </div>
  );
}
