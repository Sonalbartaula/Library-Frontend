// src/pages/Students.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import axios from "axios";

interface Student {
  id: number;
  name: string;           // ← "name", not "memberName"
  contact: string;
  type: number;           // ← 0 = Student, 1 = Faculty, etc.
  status: number;         // ← 0=Active, 1=Inactive, 2=Suspended (adjust below)
  booksIssued: number;
  joinedDate: string;     // ISO string
  overdueBooks: number;
}

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  // Fetch students from your real endpoint
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Student[]>("https://localhost:7281/api/Student/GetAll");
        setStudents(response.data);
      } catch (err) {
        console.error("Failed to load members:", err);
        setError("Failed to load members. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Helper functions
  const getTypeLabel = (type: number) => {
    switch (type) {
      case 0: return "Student";
      case 1: return "Faculty";
      case 2: return "Staff";
      case 3: return "Other";
      default: return "Unknown";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return { label: "Active", color: "bg-green-100 text-green-800" };
      case 1: return { label: "Inactive", color: "bg-gray-100 text-gray-700" };
      case 2: return { label: "Suspended", color: "bg-red-100 text-red-800" };
      default: return { label: "Unknown", color: "bg-gray-100 text-gray-700" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contact.includes(search);

      const matchesType = typeFilter === "all" || s.type === Number(typeFilter);
      const matchesStatus = statusFilter === "all" || s.status === Number(statusFilter);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [students, search, typeFilter, statusFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this member permanently?")) return;
    try {
      await axios.delete(`https://localhost:7281/api/Student/Delete/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete member");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Members Management</h1>
          <p className="text-gray-600">Manage library members and borrowing status</p>
        </div>
        <button
          onClick={() => navigate("/AddMember")}
          className="bg-[#3D89D6] hover:bg-[#326bb0] text-white px-6 py-3 rounded-lg font-medium transition"
        >
          + Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Search & Filter Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or contact..."
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="0">Student</option>
            <option value="1">Faculty</option>
            <option value="2">Staff</option>
            <option value="3">Other</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="0">Active</option>
            <option value="1">Inactive</option>
            <option value="2">Suspended</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Loading members...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Table & Mobile View */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-left hidden lg:table">
              <thead className="bg-[#3D89D6] text-white">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Books Issued</th>
                  <th className="px-6 py-4 text-center">Overdue</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => {
                    const statusInfo = getStatusLabel(s.status);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4 text-gray-700">{s.contact}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {getTypeLabel(s.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(s.joinedDate)}</td>
                        <td className="px-6 py-4 text-center font-medium">{s.booksIssued}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold ${s.overdueBooks > 0 ? "text-red-600" : "text-green-600"}`}>
                            {s.overdueBooks}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button className="text-gray-600 hover:text-blue-600"><Eye size={19} /></button>
                            <button onClick={() => navigate(`/edit-member/${s.id}`)} className="text-gray-600 hover:text-yellow-600"><Edit size={19} /></button>
                            <button onClick={() => handleDelete(s.id)} className="text-gray-600 hover:text-red-600"><Trash2 size={19} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {paginatedStudents.map((s) => {
                const statusInfo = getStatusLabel(s.status);
                return (
                  <div key={s.id} className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{s.name}</h3>
                        <p className="text-sm text-gray-600">{s.contact}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-600 hover:text-blue-600"><Eye size={18} /></button>
                        <button onClick={() => navigate(`/edit-member/${s.id}`)} className="text-gray-600 hover:text-yellow-600"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(s.id)} className="text-gray-600 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Type:</span> <span className="font-medium">{getTypeLabel(s.type)}</span></div>
                      <div><span className="text-gray-500">Status:</span> <span className={`ml-2 font-medium ${statusInfo.color.includes('green') ? 'text-green-600' : statusInfo.color.includes('red') ? 'text-red-600' : 'text-gray-600'}`}>{statusInfo.label}</span></div>
                      <div><span className="text-gray-500">Joined:</span> <span className="font-medium">{formatDate(s.joinedDate)}</span></div>
                      <div><span className="text-gray-500">Issued:</span> <span className="font-medium">{s.booksIssued}</span></div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Overdue:</span>
                        <span className={`ml-2 font-bold text-lg ${s.overdueBooks > 0 ? "text-red-600" : "text-green-600"}`}>
                          {s.overdueBooks}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t gap-4">
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} members
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg border ${page === currentPage ? "bg-[#3D89D6] text-white" : "hover:bg-gray-100"}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;