const GEOLK_API_BASE_URL = import.meta.env.VITE_GEOLK_API_BASE_URL || 'http://localhost:8001/api/v1';

export const MYLOCAL_API_BASE_URL = import.meta.env.VITE_MYLOCAL_API_BASE_URL || 'http://localhost:8000/api/v1';

// Type definitions for parameters
type RegionType = 'province' | 'district' | 'moh' | 'gnd';
type RegionId = string;

// // Type definitions for endpoint categories
// interface EndpointBuilder {
//   byType: (type: RegionType) => string;
//   byId: (id: RegionId) => string;
// }

export const API_ENDPOINTS = {
  regions: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/regions/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/region/id/${id}/`,
  },
  
  population: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/population/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/population/id/${id}/`,
  },
  
  ageDistribution: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/age-distribution/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/age-distribution/id/${id}/`,
  },
  
  ethnicityDistribution: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/ethnicity-distribution/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/ethnicity-distribution/id/${id}/`,
  },
  
  genderDistribution: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/gender-distribution/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/gender-distribution/id/${id}/`,
  },
  
  maritalStatus: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/marital-status/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/marital-status/id/${id}/`,
  },
  
  religiousAffiliation: {
    byType: (type: RegionType) => `${MYLOCAL_API_BASE_URL}/religious-affiliation/type/${type}/`,
    byId: (id: RegionId) => `${MYLOCAL_API_BASE_URL}/religious-affiliation/id/${id}/`,
  },
  
  geo: {
    byType: (type: RegionType) => `${GEOLK_API_BASE_URL}/regions/?type=${type}`,
    byId: (id: string) => `${GEOLK_API_BASE_URL}/regions/${id}/`,
  },
} as const;

// Helper function to validate region type
export const isValidRegionType = (type: string): type is RegionType => {
  return ['province', 'district', 'moh', 'gnd'].includes(type);
};

// Helper function to validate region ID format
export const isValidRegionId = (id: string): boolean => {
  const patterns = {
    province: /^LK-\d{1}$/,
    district: /^LK-\d{2}$/,
    moh: /^MOH-\d{5}$/,
    gnd: /^LK-\d{7}$/,
  };
  
  return Object.values(patterns).some(pattern => pattern.test(id));
};

// Type-safe endpoint category getter
export const getEndpointCategory = <T extends keyof typeof API_ENDPOINTS>(
  category: T
): typeof API_ENDPOINTS[T] => {
  return API_ENDPOINTS[category];
}; 