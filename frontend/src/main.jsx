import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./context/SocketContext"; // <--- ADD THIS IMPORT

// DNA Animation styles
const style = document.createElement("style");
style.innerHTML = `
@keyframes dnaFloat {
  from { transform: translateY(0px); }
  to { transform: translateY(-200px); }
}
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap your App in the Provider here */}
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);