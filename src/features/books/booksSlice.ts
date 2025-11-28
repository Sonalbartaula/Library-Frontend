import { createSlice } from '@reduxjs/toolkit';

import type { Book } from './models';
import { fetchBooks } from './bookThunk';


interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook(state, action) {
      state.books.push(action.payload);
    },
    removeBook(state, action) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.loading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      });
  }
});

export const { addBook, removeBook } = booksSlice.actions;
export default booksSlice.reducer;
