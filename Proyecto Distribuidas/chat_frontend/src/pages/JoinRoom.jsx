import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function JoinRoom() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");

  const [nickname, setNickname] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const deviceId = crypto.randomUUID();

      const response = await api.post(
        "/rooms/join",
        {
          pin,
          nickname,
          deviceId,
        }
      );

      sessionStorage.setItem(
        "room",
        JSON.stringify({
          roomId: response.data.roomId,
          nickname,
          deviceId,
          roomType:
            response.data.roomType,
        })
      );

      navigate("/chat");
    } catch (error) {
      alert(
        error.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <form
        onSubmit={handleJoin}
        className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700/70 shadow-2xl shadow-slate-900/50"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
          Join Chat Room
        </h1>
        <p className="text-center text-slate-400 mb-6 text-sm">Ingresa el PIN y elige tu nickname</p>

        <input
          type="text"
          placeholder="Room PIN (4 dígitos)"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value)
          }
          maxLength="4"
          className="w-full px-4 py-3 rounded-xl mb-4 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono tracking-widest focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
        />

        <input
          type="text"
          placeholder="Tu Nickname"
          value={nickname}
          onChange={(e) =>
            setNickname(
              e.target.value
            )
          }
          className="w-full px-4 py-3 rounded-xl mb-6 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
        />

        <button
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 hover:scale-105 hover:shadow-xl shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading
            ? "Ingresando..."
            : "Join Room"}
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;