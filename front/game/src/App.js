// import logo from './logo.svg';
import './App.css';
import Main from './main.js';
import PoseNet from './PoseNet.js'

function App() {
  return (
    <div className="App">
      <PoseNet></PoseNet>
      <Main/>
    </div>
  );
}

export default App;
