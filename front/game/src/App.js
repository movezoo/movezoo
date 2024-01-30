// import logo from './logo.svg';
import './App.css';
import Main from './main.js';
import PoseNet from './PoseNet.js'
import Cam from './Cam.js'

function App() {
  return (
    <div className="App">
      {/* <PoseNet></PoseNet> */}
      <Main/>
      <Cam />
    </div>
  );
}

export default App;
