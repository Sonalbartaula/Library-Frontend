import { createSlice } from '@reduxjs/toolkit';
import { checkoutBook, returnBook, renewBook, fetchActiveLoans, fetchHistory } from './transactionsThunk';
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
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Checkout
    builder
      .addCase(checkoutBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutBook.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Book checked out successfully!';
      })
      .addCase(checkoutBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to checkout book';
      });

    // Return Book
    builder
      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBook.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Book returned successfully!';
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to return book';
      });

    // Renew Book
    builder
      .addCase(renewBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewBook.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Book renewed successfully!';
      })
      .addCase(renewBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to renew book';
      });

    // Fetch Active Loans
    builder
      .addCase(fetchActiveLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLoans = action.payload;
      })
      .addCase(fetchActiveLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch active loans';
      });

    // Fetch History
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch history';
      });
  },
});

export const { clearError, clearSuccessMessage } = transactionsSlice.actions;
export default transactionsSlice.reducer;