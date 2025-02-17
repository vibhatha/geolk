import React, { useEffect, useState } from 'react';
import { RegionInfo } from '../types/RegionInfo';
import styles from './SidePanel.module.css';
import { DataService, PopulationData } from '../services/dataService';
import AgeDistributionChart, { AgeDistributionData } from './AgeDistributionChart';
import EthnicityDistributionChart, { EthnicityDistributionData } from './EthnicityDistributionChart';

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
  const [ageDistributionData, setAgeDistributionData] = useState<AgeDistributionData | null>(null);
  const [ethnicityDistributionData, setEthnicityDistributionData] = useState<EthnicityDistributionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRegionId) {
      setPopulationData(null);
      setAgeDistributionData(null);
      setEthnicityDistributionData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const populationData = await DataService.fetchPopulationById(selectedRegionId);
        setPopulationData(populationData);

        const ageData = await DataService.fetchAgeDistributionById(selectedRegionId);
        setAgeDistributionData(ageData);

        const ethnicityData = await DataService.fetchEthnicityDistributionById(selectedRegionId);
        setEthnicityDistributionData(ethnicityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRegionId]);

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

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : selectedRegion ? (
        <>
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

          {populationData && (
            <div className={styles.populationData}>
              <h3>Population Data</h3>
              {populationData.map((data) => (
                <div key={data.year}>
                  <h4>Population ({data.year})</h4>
                  <p>{data.total_population.toLocaleString()} people</p>
                </div>
              ))}
            </div>
          )}

          {ageDistributionData && (
            <div className={styles.ageDistribution}>
              <h3>Age Distribution</h3>
              <AgeDistributionChart data={ageDistributionData} />
            </div>
          )}

          {ethnicityDistributionData && (
            <div className={styles.ethnicityDistribution}>
              <h3>Ethnicity Distribution</h3>
              <EthnicityDistributionChart data={ethnicityDistributionData} />
            </div>
          )}
        </>
      ) : (
        <div>Select a region to view details</div>
      )}
    </div>
  );
};

export default SidePanel; 