
const API_URL = 'http://localhost:8000';

export const fetchSolarData = async (): Promise<SolarData[]> => {
  const response = await axios.get(`${API_URL}/data/`);
  return response.data;
};

export const fetchAverageData = async (period: 'daily' | 'monthly' | 'yearly'): Promise<{ period: string; average_radiation: number }> => {
  const response = await axios.get(`${API_URL}/data/average/?period=${period}`);
  return response.data;
};