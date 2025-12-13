import { createAsyncThunk } from '@reduxjs/toolkit';
import { transactionsRepository } from './transactionsRepository';
import type { CheckoutRequest, Transaction } from './model';


export const checkoutBook = createAsyncThunk<Transaction, CheckoutRequest>(
  'transactions/checkout',
  async (request) => {
    return await transactionsRepository.checkout(request);
  }
);

export const returnBook = createAsyncThunk<Transaction, number>(
  'transactions/return',
  async (transactionId) => {
    return await transactionsRepository.returnBook(transactionId);
  }
);

export const renewBook = createAsyncThunk<Transaction, number>(
  'transactions/renew',
  async (transactionId) => {
    return await transactionsRepository.renewBook(transactionId);
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