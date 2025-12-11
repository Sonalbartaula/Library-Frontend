import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, Receipt, ClipboardList, LogOut, Book } from "lucide-react";



export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-64 bg-white text-black flex flex-col shadow-2xl">
     <div className="h-20 w-full bg-[#3D89D6] flex items-center px-6 text-xl font-bold gap-3">
<Book size={26} /> Library LMS
</div>
      <div className="flex flex-col justify-between h-full mt-6 px-6">
          <nav className="flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D89D6] hover:text-white transition ${
              isActive ? "bg-[#3D89D6] text-white" : ""
            }`
          }
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D89D6] hover:text-white transition ${
              isActive ? "bg-[#3D89D6]  text-white" : ""
            }`
          }
        >
          <Receipt size={20} /> Transactions
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D89D6] hover:text-white transition ${
              isActive ? "bg-[#3D89D6]  text-white" : ""
            }`
          }
        >
          <BookOpen size={20} /> Books
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D89D6] hover:text-white transition ${
              isActive ? "bg-[#3D89D6]  text-white" : ""
            }`
          }
        >
          <Users size={20} /> Students
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-[#3D89D6] hover:text-white transition ${
              isActive ? "bg-[#3D89D6]  text-white" : ""
            }`
          }
        >
          <ClipboardList size={20} /> Reports
        </NavLink>
      </nav>
      <div className="p-4 mb-4">
        <button onClick={() => navigate("/login")}
        className="w-full flex items-center justify-center gap-2 p-3 bg-white-600 hover:bg-[#3D89D6] hover:text-white rounded-lg">
        <LogOut size={20} /> Logout
        </button>
        </div>
      </div>
    
    </div>
  );
}
