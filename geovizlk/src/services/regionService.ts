import { RegionInfo } from '../types/RegionInfo';

export const fetchRegions = async (type: string): Promise<RegionInfo[]> => {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/regions/type/${type}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} data`);
  }
  return response.json();
}; 