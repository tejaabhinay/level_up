import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useSocket } from "./context/SocketContext";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const MatchIntro = lazy(() => import("./pages/MatchIntro"));
const Matches = lazy(() => import("./pages/Matches"));
const RequestPage = lazy(() => import("./pages/RequestPage"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    socket.on("new_notification", (data) => {
      if (Notification.permission === "granted") {
        const notif = new Notification(data.title, {
          body: data.body,
          icon: "/vite.svg",
        });
        notif.onclick = () => {
          window.focus();
          window.location.href = data.url;
        };
      } else {
        alert(`${data.title}: ${data.body}`);
      }
    });

    return () => socket.off("new_notification");
  }, [socket]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/intro" element={<MatchIntro />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/request/:token" element={<RequestPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;