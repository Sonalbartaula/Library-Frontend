import { createAsyncThunk } from '@reduxjs/toolkit';
import { booksRepository } from './booksRepository';
import type { Book } from './models';


export const fetchBooks = createAsyncThunk<Book[]>('books/fetchBooks', async () => {
  return await booksRepository.getBooks();
});

export const addBookAsync = createAsyncThunk<Book, Book>(
  'books/addBook',
  async (book) => {
    return await booksRepository.addBook(book);
  }
);
