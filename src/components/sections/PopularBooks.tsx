interface PopularBooksProps {
  books: { id: number; title: string; author: string; categories:string}[];
}

const PopularBooks = ({ books }: PopularBooksProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md w-full">
    <div className="bg-[#3D89D6] w-full">
    <h2 className="text-white text-xl font-semibold mb-1">Popular Books</h2>
    <p className="text-white">Most Issued books this month</p>
    </div>
    <ul className="">
      {books.map((b) => (
        <li key={b.id} className="py-2">
          <span className="font-semibold">{b.title}</span> by {b.author}
        </li>
      ))}
    </ul>
  </div>
);

export default PopularBooks;
