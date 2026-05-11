import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/admin/login",
        {
          username,
          password,
        }
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700/70 shadow-2xl shadow-slate-900/50"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Admin Login
        </h1>
        <p className="text-center text-slate-400 mb-6 text-sm">Ingresa tus credenciales</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="w-full px-4 py-3 rounded-xl mb-4 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full px-4 py-3 rounded-xl mb-6 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
        />

        <button
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 hover:scale-105 hover:shadow-xl shadow-green-900/50"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;