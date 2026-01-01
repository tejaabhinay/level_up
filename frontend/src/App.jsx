import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import io from "socket.io-client";

// Lazy load pages
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const MatchIntro = lazy(() => import("./pages/MatchIntro"));
const Matches = lazy(() => import("./pages/Matches"));
const RequestPage = lazy(() => import("./pages/RequestPage"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    // 1. Setup Socket Connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Tell the server who we are so it knows where to send notifications
    newSocket.emit("identify", user._id);

    return () => newSocket.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/intro" element={<MatchIntro />} />
          {/* Pass the socket instance to Matches page */}
          <Route path="/matches" element={<Matches socket={socket} />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/request/:token" element={<RequestPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;