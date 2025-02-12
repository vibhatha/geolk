import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';
import SidePanel from './SidePanel';
import { RegionInfo } from "../types/RegionInfo";

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("provinces");
  const [selectedRegion, setSelectedRegion] = useState<RegionInfo | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map instance if it exists
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Create new map instance
    mapInstance.current = L.map(mapRef.current).setView([7.8731, 80.7718], 7.5);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    let selectedLayer: L.Path | null = null;

    const loadGeoJson = async (filePath: string, color: string) => {
      try {
        const response = await fetch(filePath);
        console.log(`Fetching ${filePath}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${filePath}`);
        }
        const data = await response.json();
        console.log('GeoJSON data:', data);

        if (!mapInstance.current) return;

        const features: GeoJSON.Feature<GeoJSON.Polygon>[] = data.map((coordinates: number[][]) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
          properties: {
            name: "Region Name",
            code: "Region Code",
            category: selectedCategory,
          },
        }));

        const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
          type: "FeatureCollection",
          features: features,
        };

        L.geoJSON(geoJsonData, {
          style: {
            color: color,
            weight: 2,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              if (!mapInstance.current) return;

              if (selectedLayer) {
                selectedLayer.setStyle({
                  color: color,
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
                  code: feature.properties.code || "Unknown",
                  category: selectedCategory,
                });
              }
            });
          },
        }).addTo(mapInstance.current);
      } catch (error) {
        console.error(`Error loading GeoJSON data from ${filePath}:`, error);
      }
    };

    // Define categories and their corresponding file paths and colors
    const categories = {
      provinces: [
        { path: "/provinces/LK-1.json", color: "red" },
        { path: "/provinces/LK-2.json", color: "green" },
        { path: "/provinces/LK-3.json", color: "blue" },
        { path: "/provinces/LK-4.json", color: "orange" },
        { path: "/provinces/LK-5.json", color: "purple" },
        { path: "/provinces/LK-6.json", color: "yellow" },
        { path: "/provinces/LK-7.json", color: "cyan" },
        { path: "/provinces/LK-8.json", color: "magenta" },
        { path: "/provinces/LK-9.json", color: "brown" },
      ],
      districts: [
        { path: "/districts/LK-11.json", color: "red" },
        { path: "/districts/LK-12.json", color: "green" },
        { path: "/districts/LK-13.json", color: "blue" },
        { path: "/districts/LK-21.json", color: "orange" },
        { path: "/districts/LK-22.json", color: "purple" },
        { path: "/districts/LK-23.json", color: "yellow" },
        { path: "/districts/LK-31.json", color: "cyan" },
        { path: "/districts/LK-32.json", color: "magenta" },
        { path: "/districts/LK-33.json", color: "brown" },
        { path: "/districts/LK-41.json", color: "pink" },
        { path: "/districts/LK-42.json", color: "gray" },
        { path: "/districts/LK-43.json", color: "teal" },
        { path: "/districts/LK-44.json", color: "lime" },
        { path: "/districts/LK-45.json", color: "indigo" },
        { path: "/districts/LK-51.json", color: "navy" },
        { path: "/districts/LK-52.json", color: "olive" },
        { path: "/districts/LK-53.json", color: "maroon" },
        { path: "/districts/LK-61.json", color: "gold" },
        { path: "/districts/LK-62.json", color: "silver" },
        { path: "/districts/LK-71.json", color: "crimson" },
        { path: "/districts/LK-72.json", color: "azure" },
        { path: "/districts/LK-81.json", color: "lavender" },
        { path: "/districts/LK-82.json", color: "coral" },
        { path: "/districts/LK-91.json", color: "salmon" },
        { path: "/districts/LK-92.json", color: "peach" }
      ],
    };

    const selectedFiles = categories[selectedCategory as keyof typeof categories];
    if (selectedFiles) {
      selectedFiles.forEach(file => loadGeoJson(file.path, file.color));
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [selectedCategory]);

  return (
    <div className={styles.mapContainer}>
      <div 
        ref={mapRef} 
        className={styles.mapContent}
      />
      <SidePanel 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRegion={selectedRegion}
      />
    </div>
  );
};

export default Map;
