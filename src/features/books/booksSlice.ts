import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book } from './models';
import { 
  fetchBooks, 
  fetchBookById, 
  addBookAsync, 
  updateBookAsync, 
  deleteBookAsync 
} from './bookThunk';

interface BooksState {
  books: Book[];
  currentBook: Book | null;
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentBook(state) {
      state.currentBook = null;
    },
    addBook(state, action: PayloadAction<Book>) {
      state.books.push(action.payload);
    },
    removeBook(state, action: PayloadAction<number>) {
      state.books = state.books.filter(book => book.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })

      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch book';
      })

      // Add book
      .addCase(addBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookAsync.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add book';
      })

      // Update book
      .addCase(updateBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookAsync.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        state.currentBook = action.payload;
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update book';
      })

      // Delete book
      .addCase(deleteBookAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.books = state.books.filter(book => book.id !== action.payload);
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete book';
      });
  }
});

export const { clearError, clearCurrentBook, addBook, removeBook } = booksSlice.actions;
export default booksSlice.reducer;