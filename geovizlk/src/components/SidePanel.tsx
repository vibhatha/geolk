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
          <option value="province">Provinces</option>
          <option value="district">Districts</option>
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
              <span>{selectedRegion.entity_id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Type:</label>
              <span>{selectedRegion.type}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel; 