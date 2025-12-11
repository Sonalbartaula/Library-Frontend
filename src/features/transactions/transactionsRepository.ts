
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

  async returnBook(isbn: string): Promise<Transaction> {
    const response = await api.post<Transaction>(
      `${BASE_URL}/Return/${isbn}`,
      {}
    );
    return response.data;
  },

  async renewBook(isbn: string): Promise<Transaction> {
    const response = await api.post<Transaction>(
      `${BASE_URL}/Renew/${isbn}`,
      {}
    );
    return response.data;
  },

  async getActiveLoans(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `${BASE_URL}/ActiveLoans`
    );
    return response.data;
  },

  async getHistory(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `${BASE_URL}/History`
    );
    return response.data;
  }
};