import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Matches from "./pages/Matches";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
