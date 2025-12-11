
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  categories: string;  
  totalCopies: number;
  issuedCopies: number;
  status: number;  // 0 = Available, 1 = Unavailable, etc.
  addedDate: string;
}

// Form state model for AddBook component
export interface BookFormState {
  title: string;
  author: string;
  isbn: string;
  categories: string;
  totalCopies: string;
  description: string;
}

// Book category/genre options
export const BOOK_CATEGORIES = [
  "Novel",
  "Sci-Fi",
  "Technology",
  "Horror",
  "Poetry",
  "Education",
  "Biography",
  "History",
  "Philosophy",
  "Science",
  "Business",
  "Self-Help",
  "Children",
  "Romance",
  "Mystery",
  "Fantasy",
  "Thriller",
  "Non-Fiction",
  "Fiction",
] as const;

export type BookCategory = typeof BOOK_CATEGORIES[number];

// Statistics for dashboard
export interface BookStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  categoryCounts: Record<string, number>;
}

// Filter options for book listing
export interface BookFilters {
  categories?: string;
  status?: number;
  searchQuery?: string;
}

// Sort options for book listing
export type BookSortField = 
  | "title" 
  | "author" 
  | "categories"
  | "addedDate"
  | "totalCopies";

export type SortOrder = "asc" | "desc";

export interface BookSort {
  field: BookSortField;
  order: SortOrder;
}