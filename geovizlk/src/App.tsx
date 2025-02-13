import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Map from "./components/Map";
import Info from "./components/Info";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={
          <div className="App">
            <h1>Sri Lanka Map</h1>
            <div className="container">
              <div className="left-pane">
                <Map />
              </div>
            </div>
          </div>
        } />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
};

export default App;