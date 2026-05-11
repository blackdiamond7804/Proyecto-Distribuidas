import { 
  useEffect, 
  useRef,
  useState,
} from "react";
import socket from "../services/socket.js";

function ChatBox({
  messages,
  nickname,
}) {
  const bottomRef = useRef(null);

  const [timeLeft, setTimeLeft] =
  useState({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};

      messages.forEach((msg) => {
        if (msg.isTemporary && msg.isRead && msg.readAt) {
          const endTime =new Date(msg.readAt).getTime() + msg.destroyAfter;
          const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
          updated[msg._id] = remaining;
        }
      });

      setTimeLeft(updated);
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [messages]);

  console.log(messages);
  messages.forEach((msg) => {
    console.log(
      "ID:",
      msg._id,
      "TYPE:",
      msg.type
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900">

      {messages.map((msg, index) => (
        <div
          key={index}

          onMouseEnter={() => {
            if(
              msg.isTemporary &&
              !msg.isRead &&
              msg.nickname !== nickname
            ){
              socket.emit(
                "messageRead",
                {
                  messageId: msg._id,
                  readerNickname: nickname,
                }
              );
            }
          }}
          
          className={`flex ${
            msg.nickname === nickname
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[450px] transition-all duration-300 px-4 py-3 rounded-2xl shadow-lg border ${
              msg.nickname === nickname
                ? "bg-gradient-to-br from-blue-700 to-blue-600 border-blue-500/30 shadow-blue-900/30"
                : "bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600/50 shadow-slate-900/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">

              <p className={`text-xs font-semibold ${msg.nickname === nickname ? "text-blue-100" : "text-cyan-400"}`}>
                {msg.nickname}
              </p>

              {msg.isTemporary && (
                <span className="text-[11px] font-semibold bg-gradient-to-r from-red-600 to-red-500 px-2 py-1 rounded-full text-white shadow-lg">

                  ⏱️ {msg.isRead ? `${timeLeft[msg._id] || 0}s` : "Unread"}
                </span>
              )}
            </div>

            {msg.type === "file" ? (
              <>
                {msg.fileUrl.match(
                  /\.(jpg|jpeg|png|gif|webp)$/i
                ) ? (
                  <img
                    src={`http://localhost:5000${msg.fileUrl}`}
                    alt={msg.content}
                    className="rounded-xl mt-2 max-w-[300px] cursor-pointer hover:scale-105 transition duration-200 shadow-md border border-slate-600/30"
                  />
                ) : (
                  <a
                    href={`http://localhost:5000${msg.fileUrl}`}
                    target="_blank"
                    className="text-cyan-300 hover:text-cyan-200 underline break-all transition duration-200 font-medium"
                  >
                    📄 {msg.content}
                  </a>
                )}
              </>
            ) : (
              <p className="break-words text-slate-50 leading-relaxed">
                {msg.content}
              </p>
            )}
          </div>
        </div>
      ))}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatBox;