const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const apiService = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  // Add other methods as needed (PUT, DELETE, etc.)
}; 