
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { AppDispatch, RootState } from "../../features/store";
import { deleteBookAsync, fetchBooks } from "../../features/books/bookThunk";


const Books = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { books, loading, error } = useSelector((state: RootState) => state.books);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, status]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(books.map((book) => book.categories))].filter(Boolean);
    return cats.sort();
  }, [books]);

  // Fetch books from Redux
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.isbn.includes(search);

      const matchesCategory = category === "all" || book.categories === category;

      const matchesStatus =
        status === "all" ||
        (status === "available" && book.status === 1) ||
        (status === "notavailable" && book.status === 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, search, category, status]);

  // Pagination
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / pageSize);

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await dispatch(deleteBookAsync(id)).unwrap();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Books Management</h1>
          <p className="text-gray-600">Manage your library's book collection</p>
        </div>
        <button
          onClick={() => navigate("/AddBook")}
          className="bg-[#3D89D6] hover:bg-[#326bb0] text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
        >
          + Add Book
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Search & Filter Books</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title, author or ISBN..."
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6] transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D89D6]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="notavailable">Not Available</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Loading books...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Books Table - Desktop + Mobile */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full text-left hidden sm:table">
              <thead className="bg-[#3D89D6] text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium">ISBN</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-center font-medium">Copies</th>
                  <th className="px-6 py-4 text-center font-medium">Issued</th>
                  <th className="px-6 py-4 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 text-lg">
                      No books found matching your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium">{book.title}</td>
                      <td className="px-6 py-4 text-gray-700">{book.author}</td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">{book.isbn}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {book.categories || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            book.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.status === 1 ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">{book.totalCopies}</td>
                      <td className="px-6 py-4 text-center">{book.issuedCopies}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button className="text-gray-600 hover:text-blue-600 transition">
                            <Eye size={19} />
                          </button>
                          <button
                            onClick={() => navigate(`/edit-book/${book.id}`)}
                            className="text-gray-600 hover:text-yellow-600 transition"
                          >
                            <Edit size={19} />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="text-gray-600 hover:text-red-600 transition"
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4 p-4">
              {paginatedBooks.length === 0 ? (
                <p className="text-center py-16 text-gray-500 text-lg">
                  No books found matching your filters.
                </p>
              ) : (
                paginatedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-lg">{book.title}</h4>
                      <div className="flex gap-3">
                        <button className="text-gray-600 hover:text-blue-600">
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/edit-book/${book.id}`)}
                          className="text-gray-600 hover:text-yellow-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Author: <span className="font-medium">{book.author}</span></p>
                      <p>ISBN: <span className="font-mono">{book.isbn}</span></p>
                      <p>Category: <span className="font-medium">{book.categories || "Uncategorized"}</span></p>
                      <p>
                        Status:{" "}
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            book.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.status === 1 ? "Available" : "Not Available"}
                        </span>
                      </p>
                      <p>Copies: <span className="font-medium">{book.totalCopies}</span></p>
                      <p>Issued: <span className="font-medium">{book.issuedCopies}</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50 border-t gap-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, filteredBooks.length)}
              </span>{" "}
              of <span className="font-medium">{filteredBooks.length}</span> books
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      page === currentPage
                        ? "bg-[#3D89D6] text-white border-[#3D89D6]"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;