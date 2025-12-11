import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  checkoutBook,
  returnBook,
  renewBook,
  fetchActiveLoans,
  fetchHistory
} from './transactionsThunk';
import type { Transaction } from './model';

interface TransactionsState {
  activeLoans: Transaction[];
  history: Transaction[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: TransactionsState = {
  activeLoans: [],
  history: [],
  loading: false,
  error: null,
  successMessage: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Checkout book
      .addCase(checkoutBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(checkoutBook.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.activeLoans.unshift(action.payload);
        state.successMessage = 'Book checked out successfully!';
      })
      .addCase(checkoutBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to checkout book';
      })

      // Return book
      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(returnBook.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        // Remove from active loans
        state.activeLoans = state.activeLoans.filter(
          loan => loan.isbn !== action.payload.isbn
        );
        // Add to history
        state.history.unshift(action.payload);
        state.successMessage = 'Book returned successfully!';
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to return book';
      })

      // Renew book
      .addCase(renewBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewBook.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        const index = state.activeLoans.findIndex(
          loan => loan.isbn === action.payload.isbn
        );
        if (index !== -1) {
          state.activeLoans[index] = action.payload;
        }
        state.successMessage = 'Book renewed successfully!';
      })
      .addCase(renewBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to renew book';
      })

      // Fetch active loans
      .addCase(fetchActiveLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLoans.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.activeLoans = action.payload;
      })
      .addCase(fetchActiveLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active loans';
      })

      // Fetch history
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transaction history';
      });
  }
});

export const { clearError, clearSuccessMessage } = transactionsSlice.actions;
export default transactionsSlice.reducer;