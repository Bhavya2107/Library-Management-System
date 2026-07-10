import { Book, Student, Category, IssuedBook, AdminProfile } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Computer Science', description: 'Programming, algorithms, databases, and core software systems.' },
  { id: '2', name: 'Information Technology', description: 'Network engineering, cybersecurity, cloud, and systems admin.' },
  { id: '3', name: 'Mathematics', description: 'Discrete mathematics, linear algebra, and calculus.' },
  { id: '4', name: 'Business Management', description: 'Business administration, leadership, and digital economics.' }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'B001',
    name: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    publisher: 'MIT Press',
    isbn: '978-0262033848',
    quantity: 5,
    availableCopies: 3,
    shelfNumber: 'A-12',
    status: 'Available'
  },
  {
    id: 'B002',
    name: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Computer Science',
    publisher: 'McGraw Hill',
    isbn: '978-0073523323',
    quantity: 3,
    availableCopies: 2,
    shelfNumber: 'A-15',
    status: 'Available'
  },
  {
    id: 'B003',
    name: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    category: 'Information Technology',
    publisher: 'Pearson',
    isbn: '978-0132126953',
    quantity: 4,
    availableCopies: 4,
    shelfNumber: 'B-04',
    status: 'Available'
  },
  {
    id: 'B004',
    name: 'Discrete Mathematics and its Applications',
    author: 'Kenneth H. Rosen',
    category: 'Mathematics',
    publisher: 'McGraw Hill',
    isbn: '978-0073383095',
    quantity: 2,
    availableCopies: 1,
    shelfNumber: 'C-02',
    status: 'Available'
  },
  {
    id: 'B005',
    name: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    isbn: '978-0132350884',
    quantity: 6,
    availableCopies: 5,
    shelfNumber: 'A-01',
    status: 'Available'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'S101',
    name: 'Aarav Sharma',
    enrollmentNo: 'EN202401',
    course: 'BCA',
    semester: 'III',
    email: 'aarav.sharma@college.edu',
    phone: '9876543210',
    address: 'Sector 62, Noida, UP'
  },
  {
    id: 'S102',
    name: 'Ananya Verma',
    enrollmentNo: 'EN202402',
    course: 'MCA',
    semester: 'I',
    email: 'ananya.verma@college.edu',
    phone: '9812345678',
    address: 'Rohini Sector 9, New Delhi'
  },
  {
    id: 'S103',
    name: 'Kabir Singh',
    enrollmentNo: 'EN202403',
    course: 'B.Tech CSE',
    semester: 'V',
    email: 'kabir.singh@college.edu',
    phone: '9765432109',
    address: 'Salt Lake, Kolkata, WB'
  },
  {
    id: 'S104',
    name: 'Riya Patel',
    enrollmentNo: 'EN202404',
    course: 'BCA',
    semester: 'V',
    email: 'riya.patel@college.edu',
    phone: '9543210987',
    address: 'S.G. Highway, Ahmedabad, Gujarat'
  }
];

export const INITIAL_ISSUES: IssuedBook[] = [
  {
    id: 'ISS001',
    studentId: 'S101',
    studentName: 'Aarav Sharma',
    bookId: 'B001',
    bookTitle: 'Introduction to Algorithms',
    issueDate: '2026-06-25',
    returnDate: '2026-07-15',
    status: 'Issued'
  },
  {
    id: 'ISS002',
    studentId: 'S102',
    studentName: 'Ananya Verma',
    bookId: 'B002',
    bookTitle: 'Database System Concepts',
    issueDate: '2026-06-30',
    returnDate: '2026-07-10',
    status: 'Issued'
  },
  {
    id: 'ISS003',
    studentId: 'S103',
    studentName: 'Kabir Singh',
    bookId: 'B001',
    bookTitle: 'Introduction to Algorithms',
    issueDate: '2026-06-15',
    returnDate: '2026-06-30',
    status: 'Returned'
  },
  {
    id: 'ISS004',
    studentId: 'S104',
    studentName: 'Riya Patel',
    bookId: 'B004',
    bookTitle: 'Discrete Mathematics and its Applications',
    issueDate: '2026-07-01',
    returnDate: '2026-07-16',
    status: 'Issued'
  }
];

export const INITIAL_PROFILE: AdminProfile = {
  name: 'Prof. S. R. Prasad',
  email: 'admin@library.com',
  role: 'Head Librarian / Admin',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
};
