import { GeoRegionCollection, GeoRegion } from '../types/GeoRegion';
import { API_ENDPOINTS } from '../config/api.config';
import { apiService } from './apiService';
import { RegionType } from '../types/RegionType';

export const geoService = {
  async fetchGeoJsonByType(type: RegionType): Promise<GeoRegionCollection> {
    try {
      const response = await apiService.get<GeoRegionCollection>(API_ENDPOINTS.geo.byType(type));
      return response;
    } catch (error) {
      console.error('Error fetching geo data by type:', error);
      throw error;
    }
  },

  async fetchGeoJsonById(id: string): Promise<GeoRegion> {
    try {
      const response = await apiService.get<GeoRegion>(API_ENDPOINTS.geo.byId(id));
      return response;
    } catch (error) {
      console.error('Error fetching geo data by id:', error);
      throw error;
    }
  }
}; 