import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Main from "./pages/main/Main";
import Single from "./pages/single/Single";
import Game from "./pages/game/Game";
import Result from "./pages/result/Result";
import Signup from "./components/home/Signup.jsx";
import Multi from "./pages/multi/Multi";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" element={<h1>Hello</h1>} />
        <Route path="/home" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/single" element={<Single />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/multi" element={<Multi />} />
      </Routes>
    </Router>
  );
}

export default App;
