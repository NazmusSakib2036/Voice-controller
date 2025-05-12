import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Voice from "./pages/voice";
import Text from "./pages/text";
import Language from "./pages/ln_translator"
import Home from "./pages/home"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voice_text" element={<Voice />} />
        <Route path="/text_voice" element={<Text />} /> 
        <Route path="/language_translator" element={<Language />} />
      </Routes>
    </Router>
  </React.StrictMode>
);