// import axios from "../axios/axios.min";
const API_BASE_URL = "";

// export const apiClient = axios.create({
//     baseUrl: API_BASE_URL,
// })

export const apiClient = async (endpoint, options = {}) => {
  const config = {
    method: "GET",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(
        `Error: ${response.status} ${response.statusText} - ${JSON.stringify(
          errorData
        )}`
      );
    }

    // Parse the JSON response
    return await response.json();
  } catch (error) {
    // Log the error to the console for debugging
    console.error("API request failed", error);
    throw error;
  }
};
