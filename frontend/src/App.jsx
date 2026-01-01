import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import io from "socket.io-client";

// Lazy load pages
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const MatchIntro = lazy(() => import("./pages/MatchIntro"));
const Matches = lazy(() => import("./pages/Matches"));
const RequestPage = lazy(() => import("./pages/RequestPage"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    // 1. Request Permission for Browser Notifications
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 2. Setup Socket Connection
    const socket = io("http://localhost:5000"); // Use your Render backend URL here

    // Tell the server who we are so it knows where to send notifications
    socket.emit("identify", user._id);

    // 3. Listen for global notifications
    socket.on("new_notification", (data) => {
      if (Notification.permission === "granted") {
        const notif = new Notification(data.title, {
          body: data.body,
          icon: "/vite.svg", // Path to your logo
        });

        // Redirect user to the request page when they click the notification
        notif.onclick = () => {
          window.focus();
          window.location.href = data.url;
        };
      } else {
        // Fallback if browser notifications are blocked
        alert(`${data.title}: ${data.body}`);
      }
    });

    return () => socket.disconnect();
  }, []);

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