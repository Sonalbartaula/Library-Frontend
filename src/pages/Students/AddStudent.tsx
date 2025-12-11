import { useState } from "react";
import { FiArrowLeft, FiRefreshCcw, FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addStudentAsync } from "../../features/students/studentsThunk";
import type { AppDispatch, RootState } from "../../features/store";
import type { Student, StudentFormState } from "../../features/students/model";

export default function AddStudent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const students = useSelector((state: RootState) => state.students.students);
  
  const [formData, setFormData] = useState<StudentFormState>({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    streetaddress: "",
    city: "",
    district: "",
    state: "",
    membershiptype: "student",
    semester: "1",
    faculty: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const membershipMap: Record<string, number> = {
    student: 0,
    faculty: 1,
    staff: 2,
    other: 3
  };

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
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: "",
      streetaddress: "",
      city: "",
      district: "",
      state: "",
      membershiptype: "student",
      semester: "1",
      faculty: "",
    });
    setErrors([]);
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Required field validation
    if (!formData.firstname.trim()) {
      newErrors.push("First name is required");
    }
    if (!formData.lastname.trim()) {
      newErrors.push("Last name is required");
    }
    if (!formData.email.trim()) {
      newErrors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address");
    }
    if (!formData.phonenumber.trim()) {
      newErrors.push("Phone number is required");
    }
    if (!formData.membershiptype) {
      newErrors.push("Membership type is required");
    }

    // Check for duplicate email
    const emailExists = students.some(
      (student) => student.contact && student.contact.toLowerCase().includes(formData.email.toLowerCase())
    );
    if (emailExists) {
      newErrors.push("A member with this email already exists");
    }

    // Check for duplicate phone number
    const phoneExists = students.some(
      (student) => student.contact === formData.phonenumber
    );
    if (phoneExists) {
      newErrors.push("A member with this phone number already exists");
    }

    // Check for duplicate name
    const fullName = `${formData.firstname.trim()} ${formData.lastname.trim()}`;
    const nameExists = students.some(
      (student) => student.name.toLowerCase() === fullName.toLowerCase()
    );
    if (nameExists) {
      newErrors.push("A member with this name already exists");
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
      const student: Omit<Student, "id" | "joinedDate"> = {
        name: `${formData.firstname.trim()} ${formData.lastname.trim()}`,
        contact: formData.phonenumber,
        type: membershipMap[formData.membershiptype],
        status: 0,
        booksIssued: 0,
        overdueBooks: 0,
      };

      await dispatch(addStudentAsync(student)).unwrap();
      
      setSuccessMessage(`Member "${student.name}" has been successfully added!`);
      
      // Reset form after 2 seconds and navigate back
      setTimeout(() => {
        handleReset();
        navigate("/students");
      }, 2000);
    } catch (error) {
      setErrors(["Failed to add member. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
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
            <FiCheckCircle className="flex-shrink-0" />
            <p className="font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            <FiSave /> {isSubmitting ? "Adding..." : "Add Member"}
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