import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/authInstance";


const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/Auth/Register", {
        username,
        password,
      });

      console.log("Registration success:", response.data);
      // Redirect to login page
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err.response);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-br from-green-50 via-white to-blue-50">
      <form
        onSubmit={handleRegister}
        className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96 border border-white/40"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 tracking-wide">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4 bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>

        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-medium hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
