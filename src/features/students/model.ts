export interface Student {
  id: number;
  name: string;
  contact: string;
  type: number;       // 0 = Student, 1 = Faculty, 2 = Staff
  status: number;     // 0 = Active
  booksIssued: number;
  joinedDate: string;
  overdueBooks: number;
}

// 👉 Form model ONLY for AddStudent UI
export interface StudentFormState {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;

  streetaddress: string;
  city: string;
  district: string;
  state: string;

  membershiptype: string;
  semester: string;
  faculty: string;
}
