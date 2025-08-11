import "./App.css";
import Home from "./pages/Home/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Create from "./pages/Create/Create";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
