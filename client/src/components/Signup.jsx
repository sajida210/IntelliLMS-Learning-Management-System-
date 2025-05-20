// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/login.json";

function Signup() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]           = useState("student");
  const [error, setError]         = useState("");
  const navigate                  = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#D9D9D9]">
      <div className="max-w-4xl w-full flex rounded-3xl shadow-2xl overflow-hidden bg-[#FFFFFF] z-10">
        {/* Left: Lottie + University name */}
        <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-[#EAF6F1]">
          <div className="w-64 h-64">
            <Lottie animationData={loadingAnimation} loop />
          </div>
        </div>

        {/* Right: Signup Form */}
        <div className="w-1/2 p-10 bg-[#00304D] text-[#FFFFFF]">
          <h2 className="text-3xl font-bold mb-6">Create Account</h2>
          {error && (
            <p className="text-sm text-center mb-2 text-[#FF0000]">
              {error}
            </p>
          )}
          <form onSubmit={handleSignup} className="space-y-5">
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

            {/* Role Selector */}
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="
                  w-full px-4 py-2 rounded-lg 
                  bg-[#022029] text-[#ffffff]
                  focus:outline-none focus:ring-2 focus:ring-[#022029]
                "
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`
                w-full font-semibold py-2 rounded-lg transition-all 
                ${error ? "mb-2" : ""}
                bg-[#000000] text-[#ffffff]
                hover:bg-[#1F3E63] disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              Signup
            </button>

            {/* Login Link */}
            <div className="text-sm text-center mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer text-[#5EEAD4] underline"
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
