import { API_ENDPOINTS, isValidRegionType, isValidRegionId } from '../config/api.config';
import { apiService } from './apiService';
import { AgeDistributionData } from '../components/AgeDistributionChart';

export interface PopulationData {
  region: string;
  total_population: number;
  year: number;
}

export class DataService {
  static async fetchRegionData<T>(
    category: keyof typeof API_ENDPOINTS,
    type: string,
  ): Promise<T> {
    if (!isValidRegionType(type)) {
      throw new Error(`Invalid region type: ${type}`);
    }
    
    const endpoint = API_ENDPOINTS[category].byType(type);
    return apiService.get<T>(endpoint);
  }
  
  static async fetchRegionDataById<T>(
    category: keyof typeof API_ENDPOINTS,
    id: string,
  ): Promise<T> {
    if (!isValidRegionId(id)) {
      throw new Error(`Invalid region ID: ${id}`);
    }
    
    const endpoint = API_ENDPOINTS[category].byId(id);
    return apiService.get<T>(endpoint);
  }

  static async fetchPopulationById(regionId: string): Promise<PopulationData[]> {
    if (!isValidRegionId(regionId)) {
      throw new Error(`Invalid region ID: ${regionId}`);
    }
    
    const endpoint = API_ENDPOINTS.population.byId(regionId);
    return apiService.get<PopulationData[]>(endpoint);
  }

  static async fetchAgeDistributionById(regionId: string): Promise<AgeDistributionData> {
    if (!isValidRegionId(regionId)) {
      throw new Error(`Invalid region ID: ${regionId}`);
    }
    
    const endpoint = API_ENDPOINTS.ageDistribution.byId(regionId);
    return apiService.get<AgeDistributionData>(endpoint);
  }
}   

//// Usage example:

// interface PopulationData {
//   total: number;
//   year: number;
//   // ... other fields
// }

// // Fetch population data for a province
// const populationData = await DataService.fetchRegionData<PopulationData>(
//   'population',
//   'province'
// );

// // Fetch population data for a specific region
// const regionPopulation = await DataService.fetchRegionDataById<PopulationData>(
//   'population',
//   'LK-1'
// ); 