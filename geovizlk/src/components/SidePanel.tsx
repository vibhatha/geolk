import React from 'react';
import { RegionInfo } from '../types/RegionInfo';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedRegion: RegionInfo | null;
}

const SidePanel: React.FC<SidePanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedRegion
}) => {
  return (
    <div className={styles.sidePanel}>
      <div className={styles.categorySelector}>
        <h3>Select Category</h3>
        <select 
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="provinces">Provinces</option>
          <option value="districts">Districts</option>
        </select>
      </div>

      {selectedRegion && (
        <div className={styles.regionInfo}>
          <h3>Region Information</h3>
          <div className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <label>Name:</label>
              <span>{selectedRegion.name}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Code:</label>
              <span>{selectedRegion.code}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Category:</label>
              <span>{selectedRegion.category}</span>
            </div>
            {/* Add more region information as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel; 