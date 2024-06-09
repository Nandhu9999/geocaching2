import { apiClient } from "./client.js";

async function getGeocaches() {
  try {
    const response = await apiClient("/geocache");
    if (response.success) {
      return response.geocacheList;
    }
    return [];
  } catch (err) {
    return err;
  }
}

async function postNewGeocache(imageData, geocacheName, location) {
  try {
    const response = await apiClient("/geocache/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData, geocacheName, location }),
    });
    return response;
  } catch (err) {
    return err;
  }
}

export default {
  postNewGeocache,
  getGeocaches,
};
