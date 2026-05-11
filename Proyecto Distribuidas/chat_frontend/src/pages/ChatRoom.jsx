import { useEffect, useState } from "react";

import socket from "../services/socket";

import Sidebar from "../components/Sidebar";

import ChatBox from "../components/ChatBox";

import MessageInput from "../components/MessageInput";

import UploadButton from "../components/UploadButton";

function ChatRoom() {
  const roomData = JSON.parse(
    sessionStorage.getItem("room")
  );

  const [messages, setMessages] =
    useState([]);

  const [users, setUsers] = useState([]);

  const [typing, setTyping] =
    useState("");

  const [temporaryTime, setTemporaryTime] =
    useState(0);

  useEffect(() => {
    socket.emit("joinRoom", {
      roomId: roomData.roomId,
      nickname: roomData.nickname,
      deviceId: roomData.deviceId,
    });

    socket.on(
      "previousMessages",
      (msgs) => {
        setMessages(msgs);
      }
    );

    socket.on(
      "receiveMessage",
      (message) => {
        setMessages((prev) => [
          ...prev,
          message,
        ]);
      }
    );

    socket.on(
      "messageReadUpdate",
      ({ messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? {
              ...msg,
              isRead: true,
              readAt: new Date(),
            }: msg
          )
        );
      }
    );

    socket.on("userList", (users) => {
      setUsers(users);
    });

    socket.on(
      "typing",
      ({ nickname }) => {
        setTyping(
          `${nickname} is typing...`
        );

        setTimeout(() => {
          setTyping("");
        }, 2000);
      }
    );

    socket.on(
      "messageDeleted",
      ({ messageId }) => {
        setMessages((prev) =>
          prev.filter(
            (msg) =>
              msg._id !== messageId
          )
        );
      }
    );

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = (content) => {
    socket.emit("sendMessage", {
      roomId: roomData.roomId,
      nickname: roomData.nickname,
      content,
      isTemporary: temporaryTime > 0,
      destroyAfter: temporaryTime,
    });
  };

  const handleTyping = () => {
    socket.emit("typing", {
      roomId: roomData.roomId,
      nickname: roomData.nickname,
    });
  };

  const handleUploaded = (fileMsg) => {
    socket.emit("sendFileMessage", {
      roomId: roomData.roomId,
      nickname: roomData.nickname,
      fileUrl: fileMsg.fileUrl,
      fileName: fileMsg.content,
      isTemporary: fileMsg.isTemporary,
      destroyAfter: fileMsg.destroyAfter,
    });
  };

  return (
    <div className="min-h-screen md:min-h-[100vh] flex flex-col md:flex-row bg-slate-950 text-white">

      <Sidebar users={users} />

      <div className="flex-1 flex flex-col min-h-screen md:min-h-[100vh]">

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">

          <div className="w-full sm:max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              💬 Chat Room
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm font-mono truncate">
              {roomData.roomId}
            </p>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            <p className="text-slate-300 text-sm font-semibold">
              👤 {roomData.nickname}
            </p>
            <p className="text-slate-500 text-xs sm:text-sm capitalize">
              {roomData.roomType === "multimedia" ? "🖼️ Multimedia" : "📝 Text"}
            </p>
          </div>
        </div>

        {typing && (
          <div className="px-4 md:px-6 py-2 bg-slate-900/50 border-b border-slate-700/30">
            <p className="text-slate-400 text-sm italic animate-pulse">
              ✍️ {typing}
            </p>
          </div>
        )}

        <ChatBox
          messages={messages}
          nickname={roomData.nickname}
        />

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3 md:p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700/50 shadow-lg">
          <select
            value={temporaryTime}
            onChange={(e) =>
              setTemporaryTime(
                Number(e.target.value)
              )
            }
            className="bg-slate-900 border border-slate-700 px-3 py-3 rounded-xl w-full md:w-[220px] text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition duration-200"
          >
            <option value={0}>⏱️ Normal</option>
            <option value={10000}>⚡ 10 seg</option>
            <option value={60000}>⏰ 1 min</option>
            <option value={300000}>💣 5 min</option>
          </select>

          {roomData.roomType === "multimedia" && (
            <div className="w-full md:w-auto">
              <UploadButton
                roomId={roomData.roomId}
                nickname={roomData.nickname}
                onUploaded={handleUploaded}
                temporaryTime={temporaryTime}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <MessageInput
              onSend={sendMessage}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;