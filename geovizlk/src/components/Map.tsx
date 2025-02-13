import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';
import SidePanel from './SidePanel';
import { RegionInfo } from "../types/RegionInfo";
import { fetchRegions } from "../services/regionService";

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
      const filePath = `/${region.type}s/${region.entity_id}.json`;
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${filePath}`);
        }
        const data = await response.json();

        if (!mapInstance.current) return;

        const features: GeoJSON.Feature<GeoJSON.Polygon>[] = data.map((coordinates: number[][]) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
          properties: {
            name: region.name,
            entity_id: region.entity_id,
            type: region.type,
          },
        }));

        const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
          type: "FeatureCollection",
          features: features,
        };

        L.geoJSON(geoJsonData, {
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
                  name: feature.properties.name || "Unknown",
                  entity_id: feature.properties.code || "Unknown",
                  type: feature.properties.category || "Unknown",
                });
              }
            });
          },
        }).addTo(mapInstance.current);
      } catch (error) {
        console.error(`Error loading GeoJSON data from ${filePath}:`, error);
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
      />
    </div>
  );
};

export default Map;
