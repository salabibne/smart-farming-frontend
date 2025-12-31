import axios from "axios";

const API_URL = "http://localhost:8000";

export const cropHealthService = {
  predictDisease: async (formData) => {
    try {
      const response = await axios.post('http://172.18.16.1:8000/predict', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
  },
};
