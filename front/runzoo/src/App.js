import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Main from "./pages/main/Main";
import Single from "./pages/single/Single";
import Game from "./pages/game/Game.js";
import Result from "./pages/result/Result";
import Signup from "./components/home/Signup.js"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hello" element={<h1>Hello</h1>} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Single" element={<Single />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/Result" element={<Result />} />
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
