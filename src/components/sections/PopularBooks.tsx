import React from 'react';

interface Book {
  title: string;
  author: string;
  categories: string;
  issuedCopies: number;
}

interface PopularBooksProps {
  books: Book[];
}

const PopularBooks: React.FC<PopularBooksProps> = ({ books }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Popular Books</h2>
        <p className="text-blue-50 text-sm mt-1">Most issued books this month</p>
      </div>

      {/* Books List */}
      <div className="divide-y divide-gray-100">
        {books && books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">{book.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span>by {book.author}</span>
                    <span>•</span>
                    <span>{book.categories}</span>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <span className="inline-flex items-center justify-center bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {book.issuedCopies} times
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No popular books data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularBooks;