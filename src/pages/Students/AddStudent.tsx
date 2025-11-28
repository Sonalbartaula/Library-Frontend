import { useState } from "react";
import { FiArrowLeft, FiRefreshCcw, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AddStudent(){
     const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        streetaddress: "",
        city: "",
        district: "",
        state: "",
        membershiptype: "",
        semester: "",
        faculty: "",
      });
    const navigate = useNavigate();

     const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleReset = () => {
        setFormData({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        streetaddress: "",
        city: "",
        district: "",
        state: "",
        membershiptype: "",
        semester: "",
        faculty: "",
        }

        )
    }
     const handleSubmit = () => {
    console.log("Saving student:", formData);
  };
  return (
      <div className="p-6 bg-gray-50 min-h-screen">
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-3xl font-bold">Add New Student/Member</h1>
      <p className="text-gray-500">Register a new library student/member</p>
    </div>
    <button
      onClick={() => navigate("/students")}
      className="cursor-pointer flex items-center gap-2 bg-[#3D89D6] text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      <FiArrowLeft /> Back
    </button>
  </div>

  {/* Member Information Section */}
  <div className="bg-white shadow rounded-lg p-6 space-y-6">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <FiSave /> Member Information
    </h2>
    <p className="text-gray-500 text-sm">Enter the details of the new library member</p>

    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">First Name *</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="Enter first name"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Enter last name"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@gmail.com"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
        <input
          type="text"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>
    </div>

    {/* Address Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <p className="font-medium text-gray-700">Address Information <span className="text-gray-500">(optional)</span></p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Street Address</label>
        <input
          type="text"
          name="streetaddress"
          value={formData.streetaddress}
          onChange={handleChange}
          placeholder="123 Main Street"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Kathmandu"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">District</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="Makwanpur"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="Bagmati"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>
    </div>

    {/* Membership Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <p className="font-medium text-gray-700">Membership Details</p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Membership Type *</label>
        <select
          name="membershiptype"
          value={formData.membershiptype}
          onChange={handleChange}
          className="w-full border bg-gray-100 p-2 rounded"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Semester</label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="w-full border bg-gray-100 p-2 rounded"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Faculty</label>
        <input
          type="text"
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          placeholder="Enter faculty"
          className="w-full border bg-gray-100 p-2 rounded"
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleSubmit}
        className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        <FiSave /> Add Member
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