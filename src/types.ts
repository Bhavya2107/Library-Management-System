export interface Book {
  id: string;
  name: string;
  author: string;
  category: string;
  publisher: string;
  isbn: string;
  quantity: number;
  availableCopies: number;
  shelfNumber: string;
  status: 'Available' | 'Out of Stock';
}

export interface Student {
  id: string;
  name: string;
  enrollmentNo: string;
  course: string;
  semester: string;
  email: string;
  phone: string;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface IssuedBook {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  issueDate: string;
  returnDate: string;
  status: 'Issued' | 'Returned';
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  photoUrl: string;
}
