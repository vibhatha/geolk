import React from 'react';
import { Link } from 'react-router-dom';
import './Info.css';

const Info: React.FC = () => {
  return (
    <div className="info-container">
      <nav className="info-nav">
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>
      <div className="info-content">
        <h1>About Sri Lanka</h1>
        <div className="info-sections">
          <section>
            <h2>Overview</h2>
            <p>Sri Lanka is an island country located in South Asia, known for its diverse landscapes, rich culture, and ancient history.</p>
          </section>
          <section>
            <h2>Geography</h2>
            <p>The country features tropical beaches, lowland rainforests, and highlands in the south-central region.</p>
          </section>
          <section>
            <h2>Culture</h2>
            <p>Sri Lankan culture is influenced by Buddhism and its colonial history, reflected in its architecture, festivals, and cuisine.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Info; 