import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const style = document.createElement("style");
style.innerHTML = `
@keyframes dnaFloat {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-200px);
  }
}
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
