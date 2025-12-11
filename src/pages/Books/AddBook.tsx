import { useState } from "react";
import { FiSave, FiRefreshCcw, FiArrowLeft, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../features/store";
import type { Book } from "../../features/books/models";
import { addBookAsync } from "../../features/books/bookThunk";


export default function AddBook() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const books = useSelector((state: RootState) => state.books.books);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categories: "",
    totalCopies: "",
    description: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (errors.length > 0) setErrors([]);
    if (successMessage) setSuccessMessage("");
  };

  const handleReset = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      categories: "",
      totalCopies: "",
      description: "",
    });
    setErrors([]);
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Required field validation
    if (!formData.title.trim()) {
      newErrors.push("Book title is required");
    }
    if (!formData.author.trim()) {
      newErrors.push("Author name is required");
    }
    if (!formData.isbn.trim()) {
      newErrors.push("ISBN is required");
    }
    if (!formData.categories) {
      newErrors.push("Category/Genre is required");
    }
    if (!formData.totalCopies || parseInt(formData.totalCopies) <= 0) {
      newErrors.push("Number of copies must be greater than 0");
    }

    // Check for duplicate ISBN
    const isbnExists = books.some(
      (book) => book.isbn && book.isbn.toLowerCase() === formData.isbn.trim().toLowerCase()
    );
    if (isbnExists) {
      newErrors.push("A book with this ISBN already exists");
    }

    // Check for duplicate title + author combination
    const titleAuthorExists = books.some(
      (book) =>
        book.title.toLowerCase() === formData.title.trim().toLowerCase() &&
        book.author.toLowerCase() === formData.author.trim().toLowerCase()
    );
    if (titleAuthorExists) {
      newErrors.push("A book with this title and author already exists");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      const book: Omit<Book, "id" | "issuedCopies" | "status" | "addedDate"> = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
        categories: formData.categories,
        totalCopies: parseInt(formData.totalCopies),
      };

      await dispatch(addBookAsync(book)).unwrap();

      setSuccessMessage(`Book "${book.title}" has been successfully added to the library!`);

      // Reset form after 2 seconds and navigate back
      setTimeout(() => {
        handleReset();
        navigate("/books");
      }, 2000);
    } catch (error) {
      setErrors(["Failed to add book. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-gray-500">Add a new book to the library collection</p>
        </div>
        <button
          onClick={() => navigate("/books")}
          className="cursor-pointer flex items-center gap-2 bg-[#3D89D6] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold mb-1">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Book Information Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiSave /> Book Information
        </h2>
        <p className="text-gray-500 text-sm">Enter the details of the new book</p>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Book Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full border bg-gray-100 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="w-full border bg-gray-100 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="for e.g. 978-0-06-112008-4"
              className="w-full border bg-gray-100 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Category/Genre *</label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="w-full border bg-gray-100 p-2 rounded"
              disabled={isSubmitting}
            >
              <option value="">Select category/genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Novel">Novel</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Technology">Technology</option>
              <option value="Horror">Horror</option>
              <option value="Poetry">Poetry</option>
              <option value="Education">Education</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Science">Science</option>
              <option value="Business">Business</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Children">Children</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Thriller">Thriller</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Copies *</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              placeholder="Enter the number"
              className="w-full border bg-gray-100 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the book ...."
              className="w-full border bg-gray-100 p-2 rounded h-24"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            <FiSave /> {isSubmitting ? "Adding..." : "Add Book"}
          </button>
          <button
            onClick={handleReset}
            disabled={isSubmitting}
            className={`cursor-pointer flex items-center gap-2 border px-4 py-2 rounded ${
              isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FiRefreshCcw /> Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}