import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";

import JoinRoom from "./pages/JoinRoom";

import ChatRoom from "./pages/ChatRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<JoinRoom />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/chat"
          element={<ChatRoom />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;