// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/login.json";

function Login() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate                  = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("studentId", data.studentId);
        window.dispatchEvent(new Event("storage"));
        navigate(data.role === "admin" ? "/admin" : "/student-dashboard");
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#D9D9D9]">
      <div className="max-w-4xl w-full flex rounded-3xl shadow-2xl overflow-hidden bg-[#FFFFFF]">
        {/* Left: Lottie */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-[#EAF6F1]">
          <div className="w-64 h-64">
            <Lottie animationData={loadingAnimation} loop />
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-1/2 p-10 bg-[#00304D] text-[#FFFFFF]">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="
                  w-full px-4 py-2 rounded-lg 
                  bg-[#D9D9D9] text-[#000000] 
                  focus:outline-none focus:ring-2 focus:ring-[#000000]
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="
                    w-full px-4 py-2 rounded-lg
                    bg-[#D9D9D9] text-[#000000] 
                    focus:outline-none focus:ring-2 focus:ring-[#000000]
                  "
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-[#FFFFFFB3]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-[#FF0000]">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full font-semibold py-2 rounded-lg transition-all 
                ${loading ? "bg-[#1F3E63]" : "bg-[#000000]"} 
                text-[#FFFFFF]
                hover:bg-[#1F3E63]
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Link */}
            <div className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="cursor-pointer text-[#5EEAD4] underline"
              >
                Register Now
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
