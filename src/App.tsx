import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Users, 
  Layers, 
  CalendarCheck, 
  BarChart3, 
  User, 
  Key, 
  Info, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Printer, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Download,
  BookMarked,
  UserCheck,
  AlertCircle,
  FileCode,
  ArrowLeftRight,
  Eye,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Student, Category, IssuedBook, AdminProfile } from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_BOOKS, 
  INITIAL_STUDENTS, 
  INITIAL_ISSUES, 
  INITIAL_PROFILE 
} from './data';

export default function App() {
  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('lib_logged_in') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- DATA STATES ---
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lib_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lib_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('lib_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(() => {
    const saved = localStorage.getItem('lib_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('lib_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('lib_password') || 'admin123';
  });

  // --- CURRENT ACTIVE PAGE ---
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // --- SEARCH STATES ---
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [issueSearch, setIssueSearch] = useState('');

  // --- NOTIFICATION STATE ---
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // --- CRUDS FORMS STATES ---
  // Book Form
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookFormMode, setBookFormMode] = useState<'add' | 'edit'>('add');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [bookForm, setBookForm] = useState({
    id: '',
    name: '',
    author: '',
    category: '',
    publisher: '',
    isbn: '',
    quantity: 1,
    shelfNumber: '',
    status: 'Available' as 'Available' | 'Out of Stock'
  });

  // Student Form
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentFormMode, setStudentFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentForm, setStudentForm] = useState({
    id: '',
    name: '',
    enrollmentNo: '',
    course: '',
    semester: 'I',
    email: '',
    phone: '',
    address: ''
  });

  // Category Form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormMode, setCategoryFormMode] = useState<'add' | 'edit'>('add');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Issue Book Form
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({
    studentId: '',
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days later
  });

  // Change Password Form
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...adminProfile });

  // Source Code Viewer states (for college student project evaluation)
  const [selectedFileForView, setSelectedFileForView] = useState<string>('library.sql');

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('lib_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lib_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lib_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('lib_issues', JSON.stringify(issuedBooks));
  }, [issuedBooks]);

  useEffect(() => {
    localStorage.setItem('lib_profile', JSON.stringify(adminProfile));
  }, [adminProfile]);

  useEffect(() => {
    localStorage.setItem('lib_password', adminPassword);
  }, [adminPassword]);

  // --- TRIGGER ALERT ---
  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // --- AUTH HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === adminProfile.email && loginPassword === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('lib_logged_in', 'true');
      triggerAlert('success', 'Logged in successfully as Admin.');
      setLoginError('');
    } else {
      setLoginError('Invalid Email Address or Password! Default: admin@library.com / admin123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('lib_logged_in');
    triggerAlert('success', 'Admin session logged out successfully.');
  };

  // --- CALCULATED STATISTICS ---
  const stats = useMemo(() => {
    const totalBooks = books.reduce((acc, curr) => acc + Number(curr.quantity), 0);
    const issued = issuedBooks.filter(item => item.status === 'Issued').length;
    const returned = issuedBooks.filter(item => item.status === 'Returned').length;
    const totalStudents = students.length;
    const availableBooks = books.reduce((acc, curr) => acc + Number(curr.availableCopies), 0);

    return {
      totalBooks,
      issued,
      returned,
      totalStudents,
      availableBooks
    };
  }, [books, students, issuedBooks]);

  // --- BOOK CRUD ---
  const filteredBooks = useMemo(() => {
    if (!bookSearch) return books;
    const searchLower = bookSearch.toLowerCase();
    return books.filter(b => 
      b.id.toLowerCase().includes(searchLower) ||
      b.name.toLowerCase().includes(searchLower) ||
      b.author.toLowerCase().includes(searchLower) ||
      b.category.toLowerCase().includes(searchLower) ||
      b.isbn.toLowerCase().includes(searchLower)
    );
  }, [books, bookSearch]);

  const handleAddBookClick = () => {
    setBookFormMode('add');
    setBookForm({
      id: `BK${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      author: '',
      category: categories[0]?.name || 'General',
      publisher: '',
      isbn: '',
      quantity: 1,
      shelfNumber: 'A-' + Math.floor(1 + Math.random() * 20),
      status: 'Available'
    });
    setShowBookModal(true);
  };

  const handleEditBookClick = (book: Book) => {
    setBookFormMode('edit');
    setSelectedBookId(book.id);
    setBookForm({
      id: book.id,
      name: book.name,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      isbn: book.isbn,
      quantity: book.quantity,
      shelfNumber: book.shelfNumber,
      status: book.status
    });
    setShowBookModal(true);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm(`Are you sure you want to delete Book ID: ${id}?`)) {
      setBooks(prev => prev.filter(b => b.id !== id));
      triggerAlert('success', `Book ${id} deleted successfully.`);
    }
  };

  const handleBookFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.name || !bookForm.author || !bookForm.isbn) {
      triggerAlert('danger', 'Please fill in all required fields.');
      return;
    }

    if (bookFormMode === 'add') {
      // Check for duplicate ID
      if (books.some(b => b.id === bookForm.id)) {
        triggerAlert('danger', 'Book ID already exists.');
        return;
      }
      const newBook: Book = {
        ...bookForm,
        availableCopies: bookForm.quantity,
        status: bookForm.quantity > 0 ? 'Available' : 'Out of Stock'
      };
      setBooks(prev => [newBook, ...prev]);
      triggerAlert('success', 'New Book registered successfully!');
    } else {
      // Edit
      setBooks(prev => prev.map(b => {
        if (b.id === selectedBookId) {
          // Adjust available copies based on change in total quantity
          const diff = bookForm.quantity - b.quantity;
          const newAvail = Math.max(0, b.availableCopies + diff);
          return {
            ...b,
            ...bookForm,
            availableCopies: newAvail,
            status: newAvail > 0 ? 'Available' : 'Out of Stock'
          };
        }
        return b;
      }));
      triggerAlert('success', 'Book details updated successfully!');
    }
    setShowBookModal(false);
  };

  // --- STUDENT CRUD ---
  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students;
    const searchLower = studentSearch.toLowerCase();
    return students.filter(s => 
      s.id.toLowerCase().includes(searchLower) ||
      s.name.toLowerCase().includes(searchLower) ||
      s.enrollmentNo.toLowerCase().includes(searchLower) ||
      s.course.toLowerCase().includes(searchLower)
    );
  }, [students, studentSearch]);

  const handleAddStudentClick = () => {
    setStudentFormMode('add');
    setStudentForm({
      id: `STU${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      enrollmentNo: `EN2026${Math.floor(10 + Math.random() * 90)}`,
      course: 'BCA',
      semester: 'I',
      email: '',
      phone: '',
      address: ''
    });
    setShowStudentModal(true);
  };

  const handleEditStudentClick = (student: Student) => {
    setStudentFormMode('edit');
    setSelectedStudentId(student.id);
    setStudentForm({ ...student });
    setShowStudentModal(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm(`Are you sure you want to delete Student: ${id}?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      triggerAlert('success', `Student ${id} record removed.`);
    }
  };

  const handleStudentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.enrollmentNo || !studentForm.email) {
      triggerAlert('danger', 'Please enter required student details.');
      return;
    }

    if (studentFormMode === 'add') {
      if (students.some(s => s.id === studentForm.id || s.enrollmentNo === studentForm.enrollmentNo)) {
        triggerAlert('danger', 'Student ID or Enrollment Number already registered.');
        return;
      }
      setStudents(prev => [studentForm, ...prev]);
      triggerAlert('success', 'Student registered successfully!');
    } else {
      setStudents(prev => prev.map(s => s.id === selectedStudentId ? studentForm : s));
      triggerAlert('success', 'Student record updated!');
    }
    setShowStudentModal(false);
  };

  // --- CATEGORY CRUD ---
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
  }, [categories, categorySearch]);

  const handleAddCategoryClick = () => {
    setCategoryFormMode('add');
    setCategoryForm({ name: '', description: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategoryClick = (cat: Category) => {
    setCategoryFormMode('edit');
    setSelectedCategoryId(cat.id);
    setCategoryForm({ name: cat.name, description: cat.description });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;
    if (window.confirm(`Delete category "${catToDelete.name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      triggerAlert('success', `Category "${catToDelete.name}" deleted.`);
    }
  };

  const handleCategoryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      triggerAlert('danger', 'Category Name is required.');
      return;
    }

    if (categoryFormMode === 'add') {
      const newCat: Category = {
        id: String(categories.length + 1),
        name: categoryForm.name,
        description: categoryForm.description
      };
      setCategories(prev => [...prev, newCat]);
      triggerAlert('success', 'Category added successfully!');
    } else {
      setCategories(prev => prev.map(c => c.id === selectedCategoryId ? { ...c, ...categoryForm } : c));
      triggerAlert('success', 'Category updated successfully!');
    }
    setShowCategoryModal(false);
  };

  // --- ISSUE & RETURN BOOK HANDLERS ---
  const filteredIssues = useMemo(() => {
    if (!issueSearch) return issuedBooks;
    const searchLower = issueSearch.toLowerCase();
    return issuedBooks.filter(i => 
      i.studentName.toLowerCase().includes(searchLower) ||
      i.bookTitle.toLowerCase().includes(searchLower) ||
      i.id.toLowerCase().includes(searchLower) ||
      i.status.toLowerCase().includes(searchLower)
    );
  }, [issuedBooks, issueSearch]);

  const handleOpenIssueModal = () => {
    // Pick first student and first available book as default options
    const availableBooksList = books.filter(b => b.availableCopies > 0);
    setIssueForm({
      studentId: students[0]?.id || '',
      bookId: availableBooksList[0]?.id || '',
      issueDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowIssueModal(true);
  };

  const handleIssueBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { studentId, bookId, issueDate, returnDate } = issueForm;

    if (!studentId || !bookId) {
      triggerAlert('danger', 'Please select both student and book.');
      return;
    }

    // Find student and book details
    const studentObj = students.find(s => s.id === studentId);
    const bookObj = books.find(b => b.id === bookId);

    if (!studentObj) {
      triggerAlert('danger', 'Selected student does not exist.');
      return;
    }

    if (!bookObj) {
      triggerAlert('danger', 'Selected book does not exist.');
      return;
    }

    if (bookObj.availableCopies <= 0) {
      triggerAlert('danger', 'Book is currently unavailable (Out of stock).');
      return;
    }

    // Process issue
    const newIssue: IssuedBook = {
      id: `ISS${Math.floor(1000 + Math.random() * 9000)}`,
      studentId,
      studentName: studentObj.name,
      bookId,
      bookTitle: bookObj.name,
      issueDate,
      returnDate,
      status: 'Issued'
    };

    // Update issue state
    setIssuedBooks(prev => [newIssue, ...prev]);

    // Decrement available copies of book
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const remaining = b.availableCopies - 1;
        return {
          ...b,
          availableCopies: remaining,
          status: remaining > 0 ? 'Available' : 'Out of Stock'
        };
      }
      return b;
    }));

    triggerAlert('success', `Book "${bookObj.name}" successfully issued to ${studentObj.name}.`);
    setShowIssueModal(false);
  };

  const handleReturnBook = (issueId: string) => {
    const record = issuedBooks.find(i => i.id === issueId);
    if (!record || record.status === 'Returned') return;

    if (window.confirm(`Confirm return of book "${record.bookTitle}"?`)) {
      // Update issue record
      setIssuedBooks(prev => prev.map(i => i.id === issueId ? { ...i, status: 'Returned' as const } : i));

      // Increment available copies of the book
      setBooks(prev => prev.map(b => {
        if (b.id === record.bookId) {
          const added = b.availableCopies + 1;
          return {
            ...b,
            availableCopies: added,
            status: 'Available'
          };
        }
        return b;
      }));

      triggerAlert('success', `Book returned successfully.`);
    }
  };

  // --- PASSWORD CHANGE ---
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.oldPassword !== adminPassword) {
      triggerAlert('danger', 'Current Password is incorrect!');
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      triggerAlert('danger', 'New Password and Confirm Password do not match!');
      return;
    }
    if (passForm.newPassword.length < 4) {
      triggerAlert('danger', 'New password must be at least 4 characters long.');
      return;
    }

    setAdminPassword(passForm.newPassword);
    setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    triggerAlert('success', 'Admin Password updated successfully!');
  };

  // --- PROFILE UPDATE ---
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfile({ ...profileForm });
    setIsEditingProfile(false);
    triggerAlert('success', 'Admin Profile updated successfully!');
  };

  // --- PRINT WINDOW ---
  const handlePrint = () => {
    window.print();
  };

  // Database / Code files mock directory representing exact outputs
  const codeFiles: Record<string, string> = {
    'library.sql': `-- ==========================================
-- LIBRARY MANAGEMENT SYSTEM DATABASE DUMP
-- Suitable for BCA/MCA Minor College Projects
-- ==========================================

CREATE DATABASE IF NOT EXISTS \`library_db\`;
USE \`library_db\`;

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`description\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. BOOKS TABLE
CREATE TABLE IF NOT EXISTS \`books\` (
  \`id\` varchar(20) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`author\` varchar(150) NOT NULL,
  \`category_id\` int(11) DEFAULT NULL,
  \`publisher\` varchar(150) DEFAULT NULL,
  \`isbn\` varchar(50) DEFAULT NULL,
  \`quantity\` int(11) NOT NULL DEFAULT 1,
  \`available_copies\` int(11) NOT NULL DEFAULT 1,
  \`shelf_number\` varchar(50) DEFAULT NULL,
  \`status\` varchar(20) NOT NULL DEFAULT 'Available',
  PRIMARY KEY (\`id\`),
  KEY \`fk_books_category\` (\`category_id\`),
  CONSTRAINT \`fk_books_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` varchar(20) NOT NULL,
  \`name\` varchar(150) NOT NULL,
  \`enrollment_no\` varchar(50) NOT NULL UNIQUE,
  \`course\` varchar(50) NOT NULL,
  \`semester\` varchar(10) NOT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`phone\` varchar(20) DEFAULT NULL,
  \`address\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ISSUED_BOOKS TABLE
CREATE TABLE IF NOT EXISTS \`issued_books\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`student_id\` varchar(20) NOT NULL,
  \`book_id\` varchar(20) NOT NULL,
  \`issue_date\` date NOT NULL,
  \`return_date\` date NOT NULL,
  \`status\` varchar(20) NOT NULL DEFAULT 'Issued',
  PRIMARY KEY (\`id\`),
  KEY \`fk_issue_student\` (\`student_id\`),
  KEY \`fk_issue_book\` (\`book_id\`),
  CONSTRAINT \`fk_issue_book\` FOREIGN KEY (\`book_id\`) REFERENCES \`books\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_issue_student\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ADMIN_USERS TABLE
CREATE TABLE IF NOT EXISTS \`admin_users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`email\` varchar(100) NOT NULL UNIQUE,
  \`password\` varchar(255) NOT NULL,
  \`photo_url\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT DEFAULT RECORDS
INSERT INTO \`admin_users\` (\`id\`, \`name\`, \`email\`, \`password\`, \`photo_url\`) VALUES
(1, 'Prof. S. R. Prasad', 'admin@library.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d');
-- Note: Default password is 'admin123' (hashed using standard PHP password_hash)

INSERT INTO \`categories\` (\`id\`, \`name\`, \`description\`) VALUES
(1, 'Computer Science', 'Programming, algorithms, databases, and core software systems.'),
(2, 'Information Technology', 'Network engineering, cybersecurity, cloud, and systems admin.'),
(3, 'Mathematics', 'Discrete mathematics, linear algebra, and calculus.'),
(4, 'Business Management', 'Business administration, leadership, and digital economics.');

INSERT INTO \`books\` (\`id\`, \`name\`, \`author\`, \`category_id\`, \`publisher\`, \`isbn\`, \`quantity\`, \`available_copies\`, \`shelf_number\`, \`status\`) VALUES
('B001', 'Introduction to Algorithms', 'Thomas H. Cormen', 1, 'MIT Press', '978-0262033848', 5, 3, 'A-12', 'Available'),
('B002', 'Database System Concepts', 'Abraham Silberschatz', 1, 'McGraw Hill', '978-0073523323', 3, 2, 'A-15', 'Available'),
('B003', 'Computer Networks', 'Andrew S. Tanenbaum', 2, 'Pearson', '978-0132126953', 4, 4, 'B-04', 'Available');
`,
    'db.php': `<?php
// config/db.php
// Core PHP Database Connection Configuration

\$host = "localhost";
\$dbname = "library_db";
\$username = "root";
\$password = ""; // Leave blank for standard XAMPP configuration

try {
    \$conn = new PDO("mysql:host=\$host;dbname=\$dbname;charset=utf8", \$username, \$password);
    // Set Error mode to exception for troubleshooting
    \$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    \$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException \$e) {
    die("Database Connection Failed: " . \$e->getMessage());
}
?>`,
    'header.php': `<?php
// includes/header.php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management System - College Minor Project</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
        }
        .navbar-brand {
            font-weight: 700;
            color: #2563eb !important;
        }
        .bg-custom-blue {
            background-color: #2563eb;
        }
        .hover-shadow:hover {
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important;
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>`,
    'index.php': `<?php
// index.php (Login Page)
require_once 'includes/header.php';
require_once 'config/db.php';

// Redirect if already logged in
if (isset(\$_SESSION['admin_id'])) {
    header("Location: dashboard.php");
    exit();
}

\$error = "";

if (\$_SERVER['REQUEST_METHOD'] === 'POST') {
    \$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    \$password = \$_POST['password'];

    if (\$email && \$password) {
        // Prepared statements to prevent SQL Injection
        \$stmt = \$conn->prepare("SELECT * FROM admin_users WHERE email = ?");
        \$stmt->execute([\$email]);
        \$user = \$stmt->fetch();

        if (\$user && password_verify(\$password, \$user['password'])) {
            \$_SESSION['admin_id'] = \$user['id'];
            \$_SESSION['admin_name'] = \$user['name'];
            \$_SESSION['admin_email'] = \$user['email'];
            \$_SESSION['admin_photo'] = \$user['photo_url'];
            
            header("Location: dashboard.php");
            exit();
        } else {
            \$error = "Invalid Email address or Password.";
        }
    } else {
        \$error = "All fields are required.";
    }
}
?>
<div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow border-0" style="width: 26rem; border-radius: 12px;">
        <div class="card-body p-5">
            <div class="text-center mb-4">
                <div class="bg-primary text-white d-inline-flex p-3 rounded-circle mb-3">
                    <i class="bi bi-book-half fs-2"></i>
                </div>
                <h4 class="fw-bold">Library System</h4>
                <p class="text-muted small">Admin Control Center Login</p>
            </div>
            
            <?php if (\$error): ?>
                <div class="alert alert-danger alert-dismissible fade show small" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo htmlspecialchars(\$error); ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            <?php endif; ?>

            <form action="index.php" method="POST">
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Email Address</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                        <input type="email" name="email" class="form-control border-start-0" placeholder="admin@library.com" required>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="form-label small fw-semibold">Password</label>
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="bi bi-lock text-muted"></i></span>
                        <input type="password" name="password" class="form-control border-start-0" placeholder="••••••••" required>
                    </div>
                    <div class="form-text text-end small mt-1">
                        <span class="text-muted">Default password: <strong>admin123</strong></span>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary w-full py-2.5 fw-medium" style="background-color: #2563eb;">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                </button>
            </form>
        </div>
    </div>
</div>
<?php require_once 'includes/footer.php'; ?>`,
    'dashboard.php': `<?php
// dashboard.php
require_once 'includes/header.php';
require_once 'includes/navbar.php';
require_once 'config/db.php';

// Auth Guard
if (!isset(\$_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

// Fetch totals using core MySQL queries
\$total_books = \$conn->query("SELECT SUM(quantity) as total FROM books")->fetch()['total'] ?? 0;
\$total_students = \$conn->query("SELECT COUNT(*) as total FROM students")->fetch()['total'] ?? 0;
\$issued_books = \$conn->query("SELECT COUNT(*) as total FROM issued_books WHERE status='Issued'")->fetch()['total'] ?? 0;
\$returned_books = \$conn->query("SELECT COUNT(*) as total FROM issued_books WHERE status='Returned'")->fetch()['total'] ?? 0;
\$avail_copies = \$conn->query("SELECT SUM(available_copies) as total FROM books")->fetch()['total'] ?? 0;

// Fetch Recent Issued Books
\$recent_stmt = \$conn->query("SELECT ib.*, s.name as student_name, b.name as book_name FROM issued_books ib 
                            JOIN students s ON ib.student_id = s.id 
                            JOIN books b ON ib.book_id = b.id 
                            ORDER BY ib.id DESC LIMIT 5");
\$recent_issued = \$recent_stmt->fetchAll();
?>
<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold">Welcome, <?php echo htmlspecialchars(\$_SESSION['admin_name']); ?></h2>
            <p class="text-muted small">Here's what's happening in the library today.</p>
        </div>
        <div class="text-muted small"><i class="bi bi-clock me-1"></i> System Active</div>
    </div>

    <!-- Stats Row -->
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm hover-shadow h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="p-3 bg-primary-subtle rounded text-primary me-3">
                        <i class="bi bi-bookshelf fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small fw-semibold">Total Books</h6>
                        <h4 class="fw-bold mb-0"><?php echo \$total_books; ?></h4>
                    </div>
                </div>
            </div>
        </div>
        <!-- Simulating remaining cards... See complete file on export -->
    </div>
</div>`
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* GLOBAL BANNER NOTIFICATION */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-sm ${
              alert.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            <span className="font-medium">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoggedIn ? (
        // --- ADMIN LOGIN VIEW ---
        <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-slate-100">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                <BookOpen className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Library Management</h1>
              <p className="text-slate-500 text-sm mt-1">Minor College Project • Academic Preview</p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Admin Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@library.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                  <span className="text-[10px] text-slate-400 font-mono">Default: admin123</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition duration-150 flex items-center justify-center gap-2 hover:shadow-lg shadow-blue-200"
              >
                <KeyRound className="w-4 h-4" />
                Sign In to System
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>Designed strictly with PHP, MySQL, and Bootstrap 5</p>
              <span className="inline-block mt-2 px-2.5 py-1 bg-slate-100 text-slate-600 font-mono rounded-full text-[10px]">
                Active Session: No
              </span>
            </div>
          </motion.div>
        </div>
      ) : (
        // --- MASTER APPLICATION IN-IFRAME RUNTIME ---
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          
          {/* SIDEBAR FOR DESKTOP */}
          <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 no-print">
            
            {/* BRAND HEADER */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 leading-tight">Library LMS</h2>
                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Minor Project</p>
              </div>
            </div>

            {/* ADMIN PROFILE BADGE */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <img 
                src={adminProfile.photoUrl} 
                alt="Admin Profile" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-semibold text-slate-800 truncate">{adminProfile.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{adminProfile.email}</p>
              </div>
            </div>

            {/* NAVIGATION MENU */}
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'books', label: 'Manage Books', icon: BookMarked },
                { id: 'students', label: 'Manage Students', icon: Users },
                { id: 'categories', label: 'Categories', icon: Layers },
                { id: 'issues', label: 'Issue / Return', icon: ArrowLeftRight },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'password', label: 'Change Password', icon: Key },
                { id: 'source_code', label: 'Inspect PHP Code', icon: FileCode },
                { id: 'about', label: 'About Project', icon: Info },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* LOGOUT BUTTON */}
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out Session
              </button>
            </div>
          </aside>

          {/* MAIN PAGE CONTAINER */}
          <main className="flex-1 flex flex-col min-h-0 bg-slate-50">
            
            {/* RESPONSIVE TOP NAV BAR */}
            <header className="no-print h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="md:hidden p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </span>
                <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  {activeTab.replace('_', ' ')} Overview
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Local DB Active
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </header>

            {/* INTERACTIVE PAGE CONTENT ROUTER */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              
              {/* 1. DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                      <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                        <BookMarked className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Books</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.totalBooks}</h3>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                      <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Students</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.totalStudents}</h3>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                      <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Issued</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.issued}</h3>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                      <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Returned</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.returned}</h3>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                      <div className="p-3.5 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Available Copies</p>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.availableBooks}</h3>
                      </div>
                    </div>

                  </div>

                  {/* Secondary section: Quick Actions & Recent Issued */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Recent Issued Books */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Recent Issued Books</h3>
                        <span className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => setActiveTab('issues')}>View All</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                              <th className="py-3 px-2">Record ID</th>
                              <th className="py-3 px-2">Student Name</th>
                              <th className="py-3 px-2">Book Title</th>
                              <th className="py-3 px-2">Issue Date</th>
                              <th className="py-3 px-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {issuedBooks.slice(0, 5).map((record) => (
                              <tr key={record.id} className="hover:bg-slate-50/50">
                                <td className="py-3.5 px-2 font-mono text-slate-600">{record.id}</td>
                                <td className="py-3.5 px-2 font-medium text-slate-800">{record.studentName}</td>
                                <td className="py-3.5 px-2 text-slate-600 max-w-xs truncate">{record.bookTitle}</td>
                                <td className="py-3.5 px-2 text-slate-500">{record.issueDate}</td>
                                <td className="py-3.5 px-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    record.status === 'Issued' 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">Quick Operations</h3>
                      
                      <button 
                        onClick={handleOpenIssueModal}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-100 hover:border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-800 font-medium text-xs transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                          Issue / Borrow Book
                        </span>
                        <span>&rarr;</span>
                      </button>

                      <button 
                        onClick={handleAddBookClick}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-indigo-100 hover:border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-800 font-medium text-xs transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <Plus className="w-4 h-4 text-indigo-600" />
                          Add New Book ID
                        </span>
                        <span>&rarr;</span>
                      </button>

                      <button 
                        onClick={handleAddStudentClick}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-100 hover:border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-800 font-medium text-xs transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-emerald-600" />
                          Register New Student
                        </span>
                        <span>&rarr;</span>
                      </button>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 mt-6">
                        <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Project Resources Available
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          This fully interactive demo lets you check the visual design and test all CRUD modules. Use the <strong>Inspect PHP Code</strong> tab to view complete core scripts and the SQL script.
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* 2. MANAGE BOOKS TAB */}
              {activeTab === 'books' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Search books by ID, Title, Author, ISBN..."
                        value={bookSearch}
                        onChange={(e) => setBookSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button 
                      onClick={handleAddBookClick}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-100 shrink-0 self-start"
                    >
                      <Plus className="w-4 h-4" /> Add New Book
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 bg-slate-50/55 text-slate-500 uppercase font-semibold">
                          <th className="py-3 px-3">Book ID</th>
                          <th className="py-3 px-3">Book Title</th>
                          <th className="py-3 px-3">Author</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">ISBN</th>
                          <th className="py-3 px-3 text-center">Qty / Available</th>
                          <th className="py-3 px-3">Shelf No</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBooks.map((book) => (
                          <tr key={book.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-3 font-mono text-slate-600 font-bold">{book.id}</td>
                            <td className="py-3 px-3 font-medium text-slate-900 max-w-xs">{book.name}</td>
                            <td className="py-3 px-3 text-slate-600">{book.author}</td>
                            <td className="py-3 px-3 text-slate-500">{book.category}</td>
                            <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{book.isbn}</td>
                            <td className="py-3 px-3 text-center font-medium">
                              <span className="text-slate-900">{book.quantity}</span>
                              <span className="text-slate-400 mx-1">/</span>
                              <span className={`font-semibold ${book.availableCopies > 0 ? 'text-blue-600' : 'text-rose-500'}`}>{book.availableCopies}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-500">{book.shelfNumber}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                book.availableCopies > 0 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditBookClick(book)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredBooks.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-slate-400">
                              No books registered yet matching search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. MANAGE STUDENTS TAB */}
              {activeTab === 'students' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Search students by ID, Name, Enrollment Number, Course..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button 
                      onClick={handleAddStudentClick}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-100 shrink-0 self-start"
                    >
                      <Plus className="w-4 h-4" /> Add Student
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 bg-slate-50/55 text-slate-500 uppercase font-semibold">
                          <th className="py-3 px-3">Student ID</th>
                          <th className="py-3 px-3">Name</th>
                          <th className="py-3 px-3">Enrollment No</th>
                          <th className="py-3 px-3">Course / Sem</th>
                          <th className="py-3 px-3">Email Address</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">Address</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((stud) => (
                          <tr key={stud.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-3 font-mono text-slate-600 font-bold">{stud.id}</td>
                            <td className="py-3 px-3 font-medium text-slate-900">{stud.name}</td>
                            <td className="py-3 px-3 text-slate-600 font-mono">{stud.enrollmentNo}</td>
                            <td className="py-3 px-3 text-slate-800">
                              <span className="px-2 py-0.5 bg-slate-100 rounded-lg font-medium">{stud.course}</span> 
                              <span className="text-slate-400 mx-1">Sem</span> 
                              <span className="font-semibold text-slate-700">{stud.semester}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-500">{stud.email}</td>
                            <td className="py-3 px-3 text-slate-500">{stud.phone}</td>
                            <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{stud.address}</td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditStudentClick(stud)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(stud.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400">
                              No students registered matching search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. MANAGE CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button 
                      onClick={handleAddCategoryClick}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-100 shrink-0 self-start"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 bg-slate-50/55 text-slate-500 uppercase font-semibold">
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Category Name</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCategories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-4 font-mono text-slate-500">{cat.id}</td>
                            <td className="py-3 px-4 font-bold text-slate-800">{cat.name}</td>
                            <td className="py-3 px-4 text-slate-600">{cat.description}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. ISSUE / RETURN BOOK TAB */}
              {activeTab === 'issues' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Search issue registry by student or book..."
                        value={issueSearch}
                        onChange={(e) => setIssueSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button 
                      onClick={handleOpenIssueModal}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-100 shrink-0 self-start"
                    >
                      <ArrowLeftRight className="w-4 h-4" /> Issue / Lend Book
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 bg-slate-50/55 text-slate-500 uppercase font-semibold">
                          <th className="py-3 px-3">Issue ID</th>
                          <th className="py-3 px-3">Student Name (ID)</th>
                          <th className="py-3 px-3">Book Title (ID)</th>
                          <th className="py-3 px-3">Issue Date</th>
                          <th className="py-3 px-3">Return Due Date</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredIssues.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/40">
                            <td className="py-3 px-3 font-mono text-slate-600 font-bold">{item.id}</td>
                            <td className="py-3 px-3">
                              <span className="font-semibold text-slate-800 block">{item.studentName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.studentId}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-medium text-slate-700 block max-w-xs truncate">{item.bookTitle}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.bookId}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-600">{item.issueDate}</td>
                            <td className="py-3 px-3 text-slate-600 font-medium">{item.returnDate}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Issued' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {item.status === 'Issued' ? (
                                <button 
                                  onClick={() => handleReturnBook(item.id)}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold transition border border-blue-100"
                                >
                                  Return Book
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">Returned &amp; Cleared</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. REPORTS TAB (WITH PRINT READY VIEW) */}
              {activeTab === 'reports' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">Generate Project Reports</h3>
                      <p className="text-xs text-slate-500 mt-1">Ready format for print layout and submissions.</p>
                    </div>
                    <button 
                      onClick={handlePrint}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-100 self-start"
                    >
                      <Printer className="w-4 h-4" /> Print PDF / Report
                    </button>
                  </div>

                  {/* PRINT VIEWPORT (VISIBLE DURING PRINT AND PREVIEW) */}
                  <div className="bg-white rounded-2xl border border-slate-200/85 p-8 shadow-md print-card" id="report-view">
                    
                    {/* Header for print report */}
                    <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">College Minor Project Report</h2>
                        <h1 className="text-2xl font-black text-blue-600 mt-0.5">Library Management System</h1>
                        <p className="text-xs text-slate-500 mt-1">Academic Year: 2026-2027 • Supervisor Approved</p>
                      </div>
                      <div className="text-right text-xs text-slate-500 font-mono">
                        <p>Date Generated: {new Date().toLocaleDateString()}</p>
                        <p>Operator: {adminProfile.name}</p>
                        <p className="font-semibold text-emerald-600">Database Engine: MySQL v8.0</p>
                      </div>
                    </div>

                    {/* Stats summary list */}
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4">I. Key Inventory Metrics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border border-slate-200/80 p-5 rounded-2xl bg-slate-50/50 mb-8">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Volume</p>
                        <h4 className="text-base font-extrabold text-slate-800 mt-0.5">{stats.totalBooks} Books</h4>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Active Members</p>
                        <h4 className="text-base font-extrabold text-slate-800 mt-0.5">{stats.totalStudents} Students</h4>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Currently Issued</p>
                        <h4 className="text-base font-extrabold text-slate-800 mt-0.5">{stats.issued} Issued</h4>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Returned</p>
                        <h4 className="text-base font-extrabold text-slate-800 mt-0.5">{stats.returned} Returned</h4>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Instock Available</p>
                        <h4 className="text-base font-extrabold text-emerald-700 mt-0.5">{stats.availableBooks} Copies</h4>
                      </div>
                    </div>

                    {/* Detailed Active Issue Table */}
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4">II. Active Pending Borrowers (Outstanding)</h3>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden mb-8">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100/80 text-slate-700 uppercase font-bold border-b border-slate-200">
                            <th className="py-3 px-4">Student ID</th>
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Book Title</th>
                            <th className="py-3 px-4">Issue Date</th>
                            <th className="py-3 px-4">Return Due Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {issuedBooks.filter(i => i.status === 'Issued').map((item) => (
                            <tr key={item.id}>
                              <td className="py-3.5 px-4 font-mono">{item.studentId}</td>
                              <td className="py-3.5 px-4 font-semibold text-slate-800">{item.studentName}</td>
                              <td className="py-3.5 px-4 text-slate-600">{item.bookTitle}</td>
                              <td className="py-3.5 px-4">{item.issueDate}</td>
                              <td className="py-3.5 px-4 font-bold text-slate-900">{item.returnDate}</td>
                            </tr>
                          ))}
                          {issuedBooks.filter(i => i.status === 'Issued').length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-slate-400">No outstanding books issued.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Signature Line for Academic Submission */}
                    <div className="mt-16 pt-10 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
                      <div>
                        <div className="h-12 border-b border-dashed border-slate-300 w-48 mx-auto"></div>
                        <p className="mt-2 font-medium text-slate-700">{adminProfile.name}</p>
                        <p className="text-[10px]">Head Librarian Signature</p>
                      </div>
                      <div>
                        <div className="h-12 border-b border-dashed border-slate-300 w-48 mx-auto"></div>
                        <p className="mt-2 font-medium text-slate-700">Internal/External Examiner</p>
                        <p className="text-[10px]">College Supervisor Seal</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 7. PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <img 
                      src={adminProfile.photoUrl} 
                      alt="Admin Large Photo" 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{adminProfile.name}</h3>
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg mt-1">
                        {adminProfile.role}
                      </span>
                    </div>
                  </div>

                  {!isEditingProfile ? (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider">Librarian Name</p>
                          <p className="text-slate-800 font-semibold text-sm mt-1">{adminProfile.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                          <p className="text-slate-800 font-semibold text-sm mt-1">{adminProfile.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider">Assigned Role</p>
                          <p className="text-slate-800 font-semibold text-sm mt-1">{adminProfile.role}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider">Assigned ID</p>
                          <p className="text-slate-800 font-mono text-sm mt-1">LMS-ADM-01</p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          onClick={() => {
                            setProfileForm({ ...adminProfile });
                            setIsEditingProfile(true);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition"
                        >
                          Modify Admin Details
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1.5">Librarian Name</label>
                          <input 
                            type="text"
                            required
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
                          <input 
                            type="email"
                            required
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1.5">Photo URL</label>
                          <input 
                            type="text"
                            value={profileForm.photoUrl}
                            onChange={(e) => setProfileForm(p => ({ ...p, photoUrl: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-4 text-xs">
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 8. CHANGE PASSWORD TAB */}
              {activeTab === 'password' && (
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide mb-5">Change Admin Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Current Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passForm.oldPassword}
                        onChange={(e) => setPassForm(p => ({ ...p, oldPassword: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">New Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passForm.newPassword}
                        onChange={(e) => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passForm.confirmPassword}
                        onChange={(e) => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* 9. CODE INSPECT TAB */}
              {activeTab === 'source_code' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Core PHP &amp; MySQL Project Code Viewer</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Explore the full codebase structure written specifically for your submission.</p>
                    </div>
                    <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg self-start">
                      No Placeholders Used
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* File Selector */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm h-fit space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-2">Workspace Files</p>
                      {Object.keys(codeFiles).map((filename) => (
                        <button
                          key={filename}
                          onClick={() => setSelectedFileForView(filename)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                            selectedFileForView === filename 
                              ? 'bg-blue-50 text-blue-700 font-bold' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {filename}
                        </button>
                      ))}
                    </div>

                    {/* Code Display Area */}
                    <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col h-[520px]">
                      <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center text-xs">
                        <span className="font-mono text-slate-400 font-medium flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          {selectedFileForView}
                        </span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono uppercase">
                          {selectedFileForView.endsWith('.sql') ? 'sql' : 'php'}
                        </span>
                      </div>
                      <pre className="p-5 font-mono text-[11px] leading-relaxed text-slate-300 overflow-auto flex-1 select-all bg-slate-950">
                        <code>{codeFiles[selectedFileForView]}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. ABOUT PROJECT TAB */}
              {activeTab === 'about' && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                      <BookOpen className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Library Management System</h2>
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">Minor Academic Project Specification</p>
                    <p className="text-slate-500 text-xs mt-3 max-w-xl mx-auto leading-relaxed">
                      A pristine, responsive Library Management System built strictly using <strong>Core PHP</strong>, <strong>MySQL</strong>, <strong>HTML5</strong>, <strong>CSS3</strong>, and <strong>Bootstrap 5</strong>. Perfectly engineered for BCA, MCA, and Computer Science students' semester evaluation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                      <h4 className="font-black text-slate-800 uppercase tracking-wider">Features Implemented</h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Secure Admin Login:</strong> Prepared statements authentication</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Book Registry:</strong> Full Add/Edit/View/Delete CRUD module</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Student Records:</strong> Student profiles, enrollment tracing</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Category Registry:</strong> Organized book sorting &amp; cataloging</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span><strong>Dynamic Borrowing:</strong> Prevents issuing out-of-stock items</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                      <h4 className="font-black text-slate-800 uppercase tracking-wider">Project Quick Credentials</h4>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                        <div>
                          <p className="text-slate-400 font-bold text-[10px] uppercase">Default Login ID</p>
                          <p className="text-slate-800 font-mono font-semibold mt-0.5">admin@library.com</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-[10px] uppercase">Default Password</p>
                          <p className="text-slate-800 font-mono font-semibold mt-0.5">admin123</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold text-[10px] uppercase">Database Name</p>
                          <p className="text-slate-800 font-mono font-semibold mt-0.5">library_db</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* SHARED APP FOOTER */}
            <footer className="no-print bg-white border-t border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
              <p>&copy; 2026 College Minor Project Registry. Clean Core PHP Codebase available.</p>
              <div className="flex gap-4">
                <span>Database: MySQL</span>
                <span>Framework: Bootstrap 5</span>
              </div>
            </footer>

          </main>

        </div>
      )}

      {/* --- CRUD MODALS FOR DEMO --- */}

      {/* BOOK MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                {bookFormMode === 'add' ? 'Register New Book' : 'Modify Book Details'}
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleBookFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Book ID (Primary Key)</label>
                  <input 
                    type="text" 
                    required 
                    disabled={bookFormMode === 'edit'}
                    value={bookForm.id}
                    onChange={(e) => setBookForm(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="e.g. BK001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN Number</label>
                  <input 
                    type="text" 
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm(prev => ({ ...prev, isbn: e.target.value }))}
                    placeholder="978-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Title Name</label>
                <input 
                  type="text" 
                  required
                  value={bookForm.name}
                  onChange={(e) => setBookForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full book title"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author Name</label>
                  <input 
                    type="text" 
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publisher</label>
                  <input 
                    type="text" 
                    required
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm(prev => ({ ...prev, publisher: e.target.value }))}
                    placeholder="Publisher"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select 
                    value={bookForm.category}
                    onChange={(e) => setBookForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Quantity</label>
                  <input 
                    type="number" 
                    min={0}
                    required
                    value={bookForm.quantity}
                    onChange={(e) => setBookForm(prev => ({ ...prev, quantity: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shelf Number</label>
                  <input 
                    type="text" 
                    required
                    value={bookForm.shelfNumber}
                    onChange={(e) => setBookForm(prev => ({ ...prev, shelfNumber: e.target.value }))}
                    placeholder="Shelf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                >
                  Save Book
                </button>
                <button 
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT MODAL */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                {studentFormMode === 'add' ? 'Register Student Profile' : 'Modify Student Details'}
              </h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleStudentFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student ID</label>
                  <input 
                    type="text" 
                    required 
                    disabled={studentFormMode === 'edit'}
                    value={studentForm.id}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="e.g. STU101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrollment Number</label>
                  <input 
                    type="text" 
                    required
                    value={studentForm.enrollmentNo}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, enrollmentNo: e.target.value }))}
                    placeholder="Enrollment #"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full student name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <select 
                    value={studentForm.course}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Tech CSE">B.Tech CSE</option>
                    <option value="Diploma CS">Diploma CS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select 
                    value={studentForm.semester}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <textarea 
                  rows={2}
                  value={studentForm.address}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                >
                  Save Profile
                </button>
                <button 
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                {categoryFormMode === 'add' ? 'Create Book Category' : 'Edit Category Details'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleCategoryFormSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Description</label>
                <textarea 
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of category classification"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                >
                  Save Category
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE BOOK MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                Issue Book to Student
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleIssueBookSubmit} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select 
                  required
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  <option value="">-- Choose Student Profile --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.enrollmentNo} - {s.course})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Available Book</label>
                <select 
                  required
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, bookId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 animate-none"
                >
                  <option value="">-- Choose Available Book --</option>
                  {books.filter(b => b.availableCopies > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Shelf: {b.shelfNumber} • {b.availableCopies} Left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input 
                    type="date"
                    required
                    value={issueForm.issueDate}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Return Date</label>
                  <input 
                    type="date"
                    required
                    value={issueForm.returnDate}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, returnDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                >
                  Issue Book Now
                </button>
                <button 
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
