import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Main from "./pages/main/Main";
import Single from "./pages/single/Single";
import Game from "./pages/game/Game.js";
import Result from "./pages/result/Result";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" element={<h1>Hello</h1>} />
        <Route path="/Result" element={<Result />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/Single" element={<Single />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
