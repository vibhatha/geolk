import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';
import SidePanel from './SidePanel';
import { RegionInfo } from "../types/RegionInfo";
import { fetchRegions } from "../services/regionService";
import { geoService } from '../services/geoService';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("province");
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await fetchRegions(selectedCategory);
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    loadRegions();
  }, [selectedCategory]);

  useEffect(() => {
    if (!mapRef.current || regions.length === 0) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    mapInstance.current = L.map(mapRef.current).setView([7.8731, 80.7718], 7.5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    let selectedLayer: L.Path | null = null;

    const loadGeoJson = async (region: RegionInfo) => {
      try {
        const geoData = await geoService.fetchGeoJsonById(region.entity_id);
        
        if (!mapInstance.current) return;

        L.geoJSON(geoData, {
          style: {
            color: "blue",
            weight: 2,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              if (!mapInstance.current) return;

              if (selectedLayer) {
                selectedLayer.setStyle({
                  color: "blue",
                  weight: 2,
                  fillOpacity: 0.1,
                });
              }

              if (selectedLayer === layer) {
                selectedLayer = null;
                setSelectedRegion(null);
              } else {
                (layer as L.Path).setStyle({
                  color: "red",
                  weight: 3,
                  fillOpacity: 0.6,
                });
                selectedLayer = layer as L.Path;
                
                setSelectedRegion({
                  name: feature.properties.name,
                  entity_id: feature.properties.region_id,
                  type: feature.properties.type,
                });
              }
            });
          },
        }).addTo(mapInstance.current);
      } catch (error) {
        console.error(`Error loading GeoJSON data for region ${region.entity_id}:`, error);
      }
    };

    regions.forEach(region => loadGeoJson(region));

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [regions]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.mapContent} />
      <SidePanel 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRegion={selectedRegion}
        selectedRegionId={selectedRegion ? selectedRegion.entity_id : null}
      />
    </div>
  );
};

export default Map;
