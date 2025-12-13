
import api from '../../api/authInstance';
import type { CheckoutRequest, Transaction } from './model';

const BASE_URL = '/Transaction';

export const transactionsRepository = {
  async checkout(request: CheckoutRequest): Promise<Transaction> {
    const response = await api.post<Transaction>(
      `${BASE_URL}/Checkout`,
      request
    );
    return response.data;
  },

 async returnBook(transactionId: number): Promise<Transaction> {
    const response = await api.put<Transaction>(
      `${BASE_URL}/Return/${transactionId}`,
      {}
    );
    return response.data;
  },

  async renewBook(transactionId: number): Promise<Transaction> {
    const response = await api.put<Transaction>(
      `${BASE_URL}/Renew/${transactionId}`,
      {}
    );
    return response.data;
  },

 async getActiveLoans(): Promise<Transaction[]> {
  try {
    const response = await api.get<Transaction[]>(`${BASE_URL}/ActiveLoans`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch active loans:", error.response?.data || error.message);
    return []; // return empty array so UI doesn't crash
  }
},

  async getHistory(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `${BASE_URL}/History`
    );
    return response.data;
  }
};