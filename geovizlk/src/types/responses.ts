export interface PopulationResponse {
  total: number;
  year: number;
  // ... other fields
}

export interface AgeDistributionResponse {
  ageGroups: {
    range: string;
    count: number;
  }[];
  // ... other fields
}

// Add more response types as needed 