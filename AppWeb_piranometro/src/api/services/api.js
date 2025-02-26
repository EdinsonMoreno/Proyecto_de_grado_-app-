
const API_URL = "http://localhost:8000/api";

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const fetchBlob = async (url) => {
  const response = await fetch(url);
  return response.blob();
};

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const saveLocation = async (location) => {
  return postData(`${API_URL}/location/`, location);
};

export const getLocation = async () => {
  return fetchData(`${API_URL}/location/`);
};

export const exportData = async () => {
  return fetchBlob(`${API_URL}/export-data`);
};

export const sendData = async (data) => {
  return postData(`${API_URL}/data/`, data);
};

export const sendCommand = async (command) => {
  return postData(`${API_URL}/commands/`, { command });
};
