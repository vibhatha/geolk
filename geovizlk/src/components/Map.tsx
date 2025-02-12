import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './Map.module.css';
import SidePanel from './SidePanel';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("provinces");

  useEffect(() => {
    if (!mapRef.current) return; // Ensure the map container exists

    // Initialize the map centered on Sri Lanka
    const map = L.map(mapRef.current).setView([7.8731, 80.7718], 7.5);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Track the currently selected layer
    let selectedLayer: L.Path | null = null;

    // Utility function to load and display GeoJSON data
    const loadGeoJson = async (filePath: string, color: string) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${filePath}`);
        }
        const data: [number, number][][] = await response.json();

        // Convert each sub-array into a GeoJSON Feature
        const features: GeoJSON.Feature<GeoJSON.Polygon>[] = data.map((coordinates) => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates], // Wrap in an array to match GeoJSON format
          },
          properties: {},
        }));

        // Create a FeatureCollection
        const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Polygon> = {
          type: "FeatureCollection",
          features: features,
        };

        // Add each feature to the map
        L.geoJSON(geoJsonData, {
          style: {
            color: color,
            weight: 2,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              // If there's a previously selected layer, reset its style
              if (selectedLayer) {
                selectedLayer.setStyle({
                  color: color,
                  weight: 2,
                  fillOpacity: 0.1,
                });
              }

              // If clicking the same layer, deselect it
              if (selectedLayer === layer) {
                selectedLayer = null;
              } else {
                // Select the new layer
                (layer as L.Path).setStyle({
                  color: "red",
                  weight: 3,
                  fillOpacity: 0.6,
                });
                selectedLayer = layer as L.Path;
              }
            });
          },
        }).addTo(map);
      } catch (error) {
        console.error(`Error loading GeoJSON data from ${filePath}:`, error);
      }
    };

    // Define categories and their corresponding file paths and colors
    const categories: Record<string, { path: string; color: string }[]> = {
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
        { "path": "/districts/LK-11.json", "color": "red" },
        { "path": "/districts/LK-12.json", "color": "green" },
        { "path": "/districts/LK-13.json", "color": "blue" },
        { "path": "/districts/LK-21.json", "color": "orange" },
        { "path": "/districts/LK-22.json", "color": "purple" },
        { "path": "/districts/LK-23.json", "color": "yellow" },
        { "path": "/districts/LK-31.json", "color": "cyan" },
        { "path": "/districts/LK-32.json", "color": "magenta" },
        { "path": "/districts/LK-33.json", "color": "brown" },
        { "path": "/districts/LK-41.json", "color": "pink" },
        { "path": "/districts/LK-42.json", "color": "gray" },
        { "path": "/districts/LK-43.json", "color": "teal" },
        { "path": "/districts/LK-44.json", "color": "lime" },
        { "path": "/districts/LK-45.json", "color": "indigo" },
        { "path": "/districts/LK-51.json", "color": "navy" },
        { "path": "/districts/LK-52.json", "color": "olive" },
        { "path": "/districts/LK-53.json", "color": "maroon" },
        { "path": "/districts/LK-61.json", "color": "gold" },
        { "path": "/districts/LK-62.json", "color": "silver" },
        { "path": "/districts/LK-71.json", "color": "crimson" },
        { "path": "/districts/LK-72.json", "color": "azure" },
        { "path": "/districts/LK-81.json", "color": "lavender" },
        { "path": "/districts/LK-82.json", "color": "coral" },
        { "path": "/districts/LK-91.json", "color": "salmon" },
        { "path": "/districts/LK-92.json", "color": "peach" }
    ],
      // Add more categories as needed
    };

    // Load the selected category's files
    const selectedFiles = categories[selectedCategory];
    if (selectedFiles) {
      selectedFiles.forEach(file => loadGeoJson(file.path, file.color));
    }

    // Clean up the map on component unmount
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });
      map.remove();
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
      />
    </div>
  );
};

export default Map;
