export interface CheckoutRequest {
  memberId: string;
  isbn: string;
}

export interface Transaction {
  id: string;
  memberName: string;
  memberNumber: string;
  bookTitle: string;
  isbn: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  computedStatus: 'Active' | 'Overdue' | 'Returned';
  timeLeft: string;
  fine: number;
}
