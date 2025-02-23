
const API_URL = "http://localhost:8000/api";

export const saveLocation = async (location) => {
  const response = await fetch(`${API_URL}/location/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });
  return response.json();
};

export const getLocation = async () => {
  const response = await fetch(`${API_URL}/location/`);
  return response.json();
};

export const exportData = async () => {
  const response = await fetch(`${API_URL}/export-data`);
  return response.blob();
};
