import { RegionInfo } from '../types/RegionInfo';
import { API_ENDPOINTS } from '../config/api.config';
import { apiService } from './apiService';
import { RegionType } from '../types/RegionType';

export const fetchRegions = async (type: string): Promise<RegionInfo[]> => {
  try {
    return await apiService.get<RegionInfo[]>(API_ENDPOINTS.regions.byType(type as RegionType));
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
}; 