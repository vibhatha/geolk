import React from 'react';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className={styles.sidePanel}>
      <h3>Map Layers</h3>
      <select 
        onChange={(e) => onCategoryChange(e.target.value)} 
        value={selectedCategory}
        className={styles.categorySelect}
      >
        <option value="provinces">Provinces</option>
        <option value="districts">Districts</option>
        <option value="ed">ED</option>
        <option value="gnd">GND</option>
        <option value="lg">LG</option>
      </select>
    </div>
  );
};

export default SidePanel; 