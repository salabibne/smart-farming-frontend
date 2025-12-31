import api from "@/app/lib/axios";

const BASE_URL = "/finance";

export const financeService = {
  // Create a new transaction
  createTransaction: async (data) => {
    return await api.post(BASE_URL, data);
  },

  // Get all transactions
  getAllTransactions: async () => {
    return await api.get(BASE_URL);
  },

  // Get net balance stats
  getNetBalance: async () => {
    return await api.get(`${BASE_URL}/net-balance`);
  },

  // Get transactions by category
  getTransactionsByCategory: async (category) => {
    return await api.get(`${BASE_URL}/category/${category}`);
  },
};
