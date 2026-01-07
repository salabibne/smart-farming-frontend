import api from "@/app/lib/axios";
import axios from "axios";

const BASE_URL = api.defaults.baseURL;

export const marketService = {
  // Get all products
  getAllProducts: async () => {
    return await axios.get(`${BASE_URL}/market-information`);
  },

  // Get specific product details
  getProduct: async (item) => {
    return await axios.get(`${BASE_URL}/market-information/${item}`);
  },

  // get scrape request - can be central (no arg) or specific (category arg)
  getScrapedData: async (category = "") => {
    const url = category 
      ? `${BASE_URL}/market-information/scrapedData/${encodeURIComponent(category)}`
      : `${BASE_URL}/market-information/scrapedData`;
    return await axios.get(url);
  },

  // Trigger scraping on port 8001
  triggerScraping: async (data) => {
    return await axios.post("http://localhost:8001/scraping/product", data);
  },

  // Add a new product
  addProduct: async (data) => {
    return await axios.post(`${BASE_URL}/market-information`, data);
  },
};
