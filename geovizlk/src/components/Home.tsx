import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Sri Lanka Explorer</h1>
      <div className="tiles-container">
        <Link to="/map" className="tile">
          <div className="tile-content">
            <h2>Interactive Map</h2>
            <p>Explore Sri Lanka through our interactive map</p>
          </div>
        </Link>
        <Link to="/info" className="tile">
          <div className="tile-content">
            <h2>Information</h2>
            <p>Learn more about Sri Lanka's regions and culture</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home; 