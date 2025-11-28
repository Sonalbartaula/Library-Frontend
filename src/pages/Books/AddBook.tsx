import { useState } from "react";
import { FiSave, FiRefreshCcw, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    publisher: "",
    isbn: "",
    publicationYear: "",
    language: "",
    numberOfCopies: "",
    shelfLocation: "",
    price: "",
    barcode: "",
    description: "",
    condition: "new",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      publisher: "",
      isbn: "",
      publicationYear: "",
      language: "",
      numberOfCopies: "",
      shelfLocation: "",
      price: "",
      barcode: "",
      description: "",
      condition: "new",
    });
  };

  const handleSubmit = () => {
    console.log("Saving book:", formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-gray-500">Add a new book to the library collection</p>
        </div>
        <button onClick={() => navigate("/books")}
        className="cursor-pointer flex items-center gap-2 bg-[#3D89D6] text-white px-4 py-2 rounded hover:bg-blue-700">
          <FiArrowLeft /> Back
        </button>
      </div>

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
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Select author name"
              className="w-full border bg-gray-100 p-2 rounded"
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
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Category/Genre *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border bg-gray-100 p-2 rounded"
            >
              <option value="">Select category/genre</option>
              <option value="Novel">Novel</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Technology">Technology</option>
              <option value="Horror">Horror</option>
              <option value="Poetry">Poetry</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Publisher name"
              className="w-full border bg-gray-100 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Publication Year</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="for e.g. 2025"
              className="w-full border bg-gray-100 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border bg-gray-100 p-2 rounded"
            >
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Nepali">Nepali</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Copies *</label>
            <input
              type="number"
              name="numberOfCopies"
              value={formData.numberOfCopies}
              onChange={handleChange}
              placeholder="Enter the number"
              className="w-full border bg-gray-100 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Shelf Location</label>
            <input
              type="text"
              name="shelfLocation"
              value={formData.shelfLocation}
              onChange={handleChange}
              placeholder="for e.g. A-1-001"
              className="w-full border bg-gray-100 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full border bg-gray-100 p-2 rounded"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price (Rs)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="499"
              className="w-full border bg-gray-100 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Barcode *</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter the book’s barcode"
              className="w-full border bg-gray-100 p-2 rounded"
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
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <FiSave /> Add Book
          </button>
          <button
            onClick={handleReset}
            className="cursor-pointer flex items-center gap-2 bg-white border px-4 py-2 rounded hover:bg-gray-100"
          >
            <FiRefreshCcw /> Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}
