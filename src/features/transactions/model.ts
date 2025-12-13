export interface CheckoutRequest {
  memberName: string;
  bookTitle: string;
  isbn: string;
}

export interface Transaction {
  id: number;
  memberName: string;
  memberNumber: string;
  bookTitle: string;
  bookName:string,
  isbn: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string ;
  computedStatus: 'Active' | 'Overdue' | 'Returned';
  timeLeft: string;
  fine: number;
}
