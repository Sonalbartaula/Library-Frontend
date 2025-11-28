import axios from 'axios';
import type { Book } from './models';


export const booksRepository = {
  async getBooks(): Promise<Book[]> {
    const response = await axios.get('/api/books');
    return response.data;
  },
  async addBook(book: Book): Promise<Book> {
    const response = await axios.post('/api/books', book);
    return response.data;
  },
  async deleteBook(id: number): Promise<void> {
    await axios.delete(`/api/books/${id}`);
  }
 
  
};
