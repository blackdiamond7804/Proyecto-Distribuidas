import { useState } from "react";

import api from "../api/axios";

function Dashboard() {
  const [type, setType] =
    useState("text");

  const [roomData, setRoomData] =
    useState(null);

  const createRoom = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/rooms/create",
        {
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoomData(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-slate-700/70 shadow-2xl shadow-slate-900/50">

        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-center text-slate-400 mb-6 text-sm">Crea una nueva sala de chat</p>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full px-4 py-3 rounded-xl mb-4 bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
        >
          <option value="text">
            Text Room
          </option>

          <option value="multimedia">
            Multimedia Room
          </option>
        </select>

        <button
          onClick={createRoom}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 hover:scale-105 hover:shadow-xl shadow-purple-900/50"
        >
          Create Room
        </button>

        {roomData && (
          <div className="mt-6 bg-gradient-to-r from-slate-700 to-slate-800 p-5 rounded-xl border border-slate-600/70 shadow-lg">

            <p className="text-slate-300 mb-2">
              <span className="font-semibold text-cyan-400">Room ID:</span>
              <br />
              <span className="text-xs font-mono text-slate-400">{roomData.roomId}</span>
            </p>

            <p className="text-slate-300 mb-2">
              <span className="font-semibold text-cyan-400">PIN:</span>
              <br />
              <span className="text-lg font-bold text-green-400">{roomData.pin}</span>
            </p>

            <p className="text-slate-300">
              <span className="font-semibold text-cyan-400">Type:</span>
              <br />
              <span className="capitalize text-purple-400">{roomData.type}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;