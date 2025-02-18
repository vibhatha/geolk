export interface GeoRegion {
  type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection" | "Feature" | "FeatureCollection";
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    id: number;
    name: string;
    region_id: string;
    type: string;
  };
}

export interface GeoRegionCollection {
  type: "FeatureCollection";
  features: GeoRegion[];
} 