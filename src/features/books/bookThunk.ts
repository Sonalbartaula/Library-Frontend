import { createAsyncThunk } from '@reduxjs/toolkit';
import { booksRepository } from './booksRepository';
import type { Book } from './models';

export const fetchBooks = createAsyncThunk<Book[]>(
  'books/fetchBooks',
  async () => {
    return await booksRepository.getBooks();
  }
);

export const fetchBookById = createAsyncThunk<Book, number>(
  'books/fetchBookById',
  async (id) => {
    return await booksRepository.getBookById(id);
  }
);

export const addBookAsync = createAsyncThunk<Book, Omit<Book, 'id' | 'issuedCopies' | 'status' | 'addedDate'>>(
  'books/addBook',
  
  async (book) => {
    return await booksRepository.addBook(book);
  }
);

export const updateBookAsync = createAsyncThunk<Book, { id: number; book: Partial<Book> }>(
  'books/updateBook',
  async ({ id, book }) => {
    return await booksRepository.updateBook(id, book);
  }
);

export const deleteBookAsync = createAsyncThunk<number, number>(
  'books/deleteBook',
  async (id) => {
    await booksRepository.deleteBook(id);
    return id;
  }
);
