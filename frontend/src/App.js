import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import UploadMusicPage from "./Pages/UploadMusicPage";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"></header> */}
      <div className="mainContainer">
      <Router>
        <NavBar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadMusicPage />} />
        </Routes>
      </Router>
      </div>
    </div>
  );
}

export default App;
