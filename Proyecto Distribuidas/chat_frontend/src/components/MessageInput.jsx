import { useState } from "react";

function MessageInput({
  onSend,
  onTyping,
}) {
  const [message, setMessage] =
    useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="flex gap-2 md:gap-3">

      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          onTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        className="flex-1 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl outline-none text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
      />

      <button
        onClick={handleSend}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold px-4 md:px-6 py-3 rounded-xl transition duration-200 hover:scale-105 hover:shadow-lg shadow-blue-900/50 whitespace-nowrap"
      >
        Enviar
      </button>
    </div>
  );
}

export default MessageInput;