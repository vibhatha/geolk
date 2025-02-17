import React, { useEffect, useState } from 'react';
import { RegionInfo } from '../types/RegionInfo';
import styles from './SidePanel.module.css';
import { DataService, PopulationData } from '../services/dataService';

interface SidePanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedRegion: RegionInfo | null;
  selectedRegionId: string | null;
}

const SidePanel: React.FC<SidePanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedRegion,
  selectedRegionId
}) => {
  const [populationData, setPopulationData] = useState<PopulationData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!selectedRegionId) {
        setPopulationData(null);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const data = await DataService.fetchPopulationById(selectedRegionId);
        console.log(data);
        setPopulationData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch population data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedRegionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!populationData) return <div>Select a region to view details</div>;

  return (
    <div className={styles.sidePanel}>
      <div className={styles.categorySelector}>
        <h3>Jurisdiction</h3>
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

      <div className={styles.populationData}>
        <h3>Population Data</h3>
        {populationData.map((data) => (
          <div key={data.year}>
            <h4>Population ({data.year})</h4>
            <p>{data.total_population.toLocaleString()} people</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidePanel; 