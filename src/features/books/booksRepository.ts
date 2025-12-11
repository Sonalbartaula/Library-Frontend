
import api from '../../api/authInstance';
import type { Book } from './models';

const BASE_URL = '/Book';

export const booksRepository = {
  async getBooks(): Promise<Book[]> {
    const response = await api.get<Book[]>(`${BASE_URL}/Books`);
    return response.data;
  },

  async getBookById(id: number): Promise<Book> {
    const response = await api.get<Book>(`${BASE_URL}/Books/${id}`);
    return response.data;
  },

  async addBook(book: Omit<Book, 'id' | 'issuedCopies' | 'status' | 'addedDate'>): Promise<Book> {
    const response = await api.post<Book>(`${BASE_URL}/AddBooks`, book);
    return response.data;
  },

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    const response = await api.put<Book>(`${BASE_URL}/UpdateBooks/${id}`, book);
    return response.data;
  },

  async deleteBook(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/DeleteBooks/${id}`);
  }
};