export interface Book {
  id: number;                 // Unique identifier for the book
  title: string;              // Title of the book
  author: string;             // Author name
  category: string;           // Book category or genre
  publisher: string;          // Publisher name
  isbn: string;               // ISBN number (unique for each edition)
  publicationYear: number;    // Year the book was published
  language: string;           // Language of the book
  copies: number;             // Number of copies available
  barcode: string;            // Barcode for the book
  status?: 'available' | 'notAvailable' ; 
}