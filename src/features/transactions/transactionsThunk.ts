import { createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsRepository } from './transactionsRepository';
import type { CheckoutRequest, Transaction } from './model';


export const checkoutBook = createAsyncThunk<Transaction, CheckoutRequest>(
  'transactions/checkout',
  async (request) => {
    return await transactionsRepository.checkout(request);
  }
);

export const returnBook = createAsyncThunk<Transaction, { isbn: string; memberName: string }>(
  'transactions/return',
  async ({ isbn}) => {
    return await transactionsRepository.returnBook(isbn);
  }
);

export const renewBook = createAsyncThunk<Transaction, string>(
  'transactions/renew',
  async (isbn) => {
    return await transactionsRepository.renewBook(isbn);
  }
);

export const fetchActiveLoans = createAsyncThunk<Transaction[]>(
  'transactions/fetchActiveLoans',
  async () => {
    return await transactionsRepository.getActiveLoans();
  }
);

export const fetchHistory = createAsyncThunk<Transaction[]>(
  'transactions/fetchHistory',
  async () => {
    return await transactionsRepository.getHistory();
  }
);