import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/home.css';

const Home = () => {
  return (  
    <div className="home-container">
      <nav className="main-navigation">
        <h1>Discover the Future of Voice</h1>
        <p className="intro-text">Choose a tool below to begin your experience:</p>
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/voice_text" className="nav-link">
              <i className="fas fa-microphone-alt"></i> Voice to Text
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/text_voice" className="nav-link">
              <i className="fas fa-volume-up"></i> Text to Voice
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/language_translator" className="nav-link">
              <i className="fas fa-volume-up"></i> Text to Voice
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
