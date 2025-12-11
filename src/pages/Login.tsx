import React, { useState } from "react";
import { loginService } from "../services/authService";
import { useAuth } from "../context/authContext";

const Login = () => {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();         
  setLoading(true);
  setError("");

  console.log("=== LOGIN STARTED ===");
  console.log("Username:", username);

  try {
    console.log("Calling loginService...");
    const data = await loginService(username, password);
    
    console.log("=== LOGIN RESPONSE ===");
    console.log("Full data received:", data);
    console.log("Token:", data.token);
    console.log("Token type:", typeof data.token);
    console.log("Token is undefined?", data.token === undefined);
    console.log("User:", data.user);
    
    console.log("Calling login function...");
    login(data.token, data.user);
    
    console.log("Token stored in localStorage:", localStorage.getItem("accessToken"));
    
    window.location.href = "/dashboard";
  } catch (err: any) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error:", err);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen w-full flex justify-center items-center bg-linear-to-br from-blue-50 via-white to-indigo-100">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96 border border-white/40"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-wide">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4 bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Username</label>
          <input
            type="username"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="username"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Forgot password?{" "}
          <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
            Reset here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
