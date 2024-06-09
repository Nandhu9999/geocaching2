import { apiClient } from "./client.js";

async function getGeocacheQuiz(id) {
  try {
    const response = await apiClient(`/geocache/quiz/${id}`);
    return response;
  } catch (err) {
    return err;
  }
}

async function submitGeocacheQuiz(scientific_name, quiz_id, answer) {
  try {
    const response = await apiClient("/geocache/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scientific_name, quiz_id, answer }),
    });
    return response;
  } catch (err) {
    return err;
  }
}

export default {
  getGeocacheQuiz,
  submitGeocacheQuiz,
};
