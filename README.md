# 📚 Advanced Library Management System

[![PHP Version](https://img.shields.io/badge/PHP-8.0%20%7C%208.1%20%7C%208.2-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![Database](https://img.shields.io/badge/MySQL-8.0%20%7C%20MariaDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-D22128?style=for-the-badge)](LICENSE)
[![Security](https://img.shields.io/badge/Security-Prepared%20Statements%20%26%20Transactions-success?style=for-the-badge)](https://owasp.org/)

An elegant, secure, and production-ready **Library Management System** engineered specifically for college academic evaluations (such as **BCA, MCA, B.Sc CS, B.Tech CSE, and Diploma** project reviews). 

This system is built using clean, vanilla **Core PHP (OOP/Procedural via PDO)**, **MySQL**, **HTML5**, **CSS3 variables**, and **Bootstrap 5**. It operates with **zero third-party frameworks or heavy Node/Composer dependencies**, ensuring effortless installation and exceptional speed on any traditional standard shared server or localhost (XAMPP/WAMP).

---

## 🌟 Key Project Highlights & Features

### 1. 📊 Centralized Admin Analytics Dashboard
- **Dynamic Stats Trackers**: Instant numeric insights showing Total Titles, Active Registered Students, Outstanding Issued Books, and Available Stock.
- **Lending Metrics Visuals**: Visual counters and progress indicators highlighting book circulation rates.
- **Recent Lending Ledger**: A chronological feed tracking the latest checkouts and return statuses in real-time.

### 2. 📖 Comprehensive Book Inventory (CRUD)
- **Catalogs & Shelving**: Full catalog management with authors, publishers, ISBNs, quantities, and specific storage shelf coordinates (e.g., `Shelf B-12`).
- **Real-Time Copy Tracker**: Dynamically tracks both `Total Quantity` and `Available Copies` as books circulate.
- **Search & Filter Registry**: Instant search by Title, Author, ISBN, Category, or Book ID.

### 3. 🎓 Student Registry & Membership Directory
- **Academic Verification**: Track enrollment numbers, contact details, departments/courses (BCA, MCA, B.Tech, etc.), and active semesters.
- **Lending Locks Guard**: Prevents the removal of student accounts if they hold outstanding unreturned books.

### 4. 🏷️ Taxonomic Category Classification
- Group books logically into structural sections (e.g., *Computer Science, Mathematics, Literature*).
- Supports full customization of tags and group descriptions.

### 5. 🔄 Transaction-Safe Lending Engine
- **Atomic Book Checkouts**: Auto-deducts library stock upon issuing a title.
- **Guaranteed Returns**: Increments the stock count back into circulation upon return.
- **Date Safety Thresholds**: Dynamic calculators to define expected return boundaries and prevent inventory leakage.

### 6. 🔒 Hardened Security Management
- **Password Salting**: Native high-entropy hashes using modern standard `PASSWORD_BCRYPT`.
- **Session Authentication Shields**: Full auth guard protection on all files preventing deep-link catalog bypasses.

---

## 🛡️ Industrial Security & Implementation Quality

This project is tailored to bypass traditional "amateur code" pitfalls. It is engineered against the top **OWASP Web Vulnerabilities**:

### A. SQL Injection Prevention
The application **never** concatenates input strings into raw SQL statements. It enforces native PHP PDO Prepared Statements with parameterized token bindings:
```php
// Secure Book Update Statement
$stmt = $conn->prepare("UPDATE books SET name = ?, author = ?, quantity = ? WHERE id = ?");
$stmt->execute([$title_name, $author_name, $total_quantity, $book_id]);
```

### B. Dynamic Inventory Stock Synchronization via Atomic Transactions
To prevent desynchronization of book quantities (e.g. if a checkout fails halfway), the lending engine wraps actions inside **Atomic Database Transactions**. If any query fails, the entire transaction rolls back cleanly:
```php
try {
    $conn->beginTransaction();
    
    // 1. Record the lending transaction
    $ins_stmt = $conn->prepare("INSERT INTO issued_books (student_id, book_id, issue_date, return_date) VALUES (?, ?, ?, ?)");
    $ins_stmt->execute([$student_id, $book_id, $issue_date, $return_date]);
    
    // 2. Decrement physical inventory copies safely
    $dec_stmt = $conn->prepare("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?");
    $dec_stmt->execute([$book_id]);
    
    $conn->commit();
} catch (Exception $e) {
    $conn->rollBack(); // Reverts any database changes to maintain stock integrity
}
```

### C. Native Bcrypt Password Hashing
Rather than outdated MD5 or SHA1 algorithms, admin credentials are encrypted using PHP’s secure `password_hash()` implementing industry-standard blowfish-based salting:
```php
$secure_hash = password_hash($new_password, PASSWORD_BCRYPT);
```

---

## 📊 Relational Database Architecture

This system implements a strict normalized schema utilizing relational integrity keys and cascade constraints:

```text
  ┌──────────────────┐               ┌──────────────────┐
  │    CATEGORIES    │               │     STUDENTS     │
  ├──────────────────┤               ├──────────────────┤
  │ id (PK, AutoInc) │               │ id (PK, Varchar) │
  │ name             │               │ name             │
  │ description      │               │ enrollment_no    │
  └────────┬─────────┘               │ course           │
           │ 1                       │ semester         │
           │                         │ email            │
           │ N (Foreign Key)         │ phone            │
  ┌────────▼─────────┐               │ address          │
  │      BOOKS       │               └────────┬─────────┘
  ├──────────────────┤                        │ 1
  │ id (PK, Varchar) │                        │
  │ isbn (Unique)    │                        │
  │ name             │                        │
  │ author           │                        │
  │ category_id (FK) ├─┐                      │
  │ available_copies │ │                      │
  │ shelf_number     │ │ 1                    │ N
  └──────────────────┘ │                      │
                       │               ┌──────▼───────────┐
                       │               │   ISSUED_BOOKS   │
                       │               ├──────────────────┤
                       │               │ id (PK, AutoInc) │
                       └──────────────►│ book_id (FK)     │
                                     N │ student_id (FK)  │
                                       │ issue_date       │
                                       │ return_date      │
                                       │ status (Enum)    │
                                       └──────────────────┘
```

---

## 📂 Workspace Directory Tree

```text
Library-Management-System/
├── config/
│   └── db.php                  # Secure PDO database hook configurations
├── database/
│   └── library.sql             # SQL database script with schema & seed values
├── includes/
│   ├── header.php              # Global headers and Tailwind/Bootstrap CSS imports
│   ├── navbar.php              # Responsive cross-device navigation menu
│   └── footer.php              # Global scripts and system footers
├── books/
│   ├── index.php               # Book inventory dashboard (CRUD list view)
│   ├── add.php                 # Intake form for new book titles
│   └── edit.php                # Modifier form for book parameters
├── students/
│   ├── index.php               # Student directory with active check-out locks
│   ├── add.php                 # Student registration form
│   └── edit.php                # Student record modifier form
├── categories/
│   ├── index.php               # Book category groups catalog
│   ├── add.php                 # Category registration form
│   └── edit.php                # Category modifier form
├── issue/
│   ├── index.php               # Book lending registry (Return actions manager)
│   └── add.php                 # Lending transaction launcher (Deducts stock)
├── index.php                   # Portal login page (Admin gatekeeper authentication)
├── dashboard.php               # Analytical control center & overview grid
├── profile.php                 # Admin personal profile manager
├── change_password.php         # Secure password reset module
└── logout.php                  # Safe session destruction protocol
```

---

## 🛠️ Step-by-Step Installation Guide (Localhost via XAMPP)

Follow these directions to host and present this project locally:

### Step 1: Clone or Place the Project Root
1. Download or clone this repository.
2. Open your local web server's public root directory (e.g. **XAMPP**):
   - **Windows**: `C:\xampp\htdocs\`
   - **macOS**: `/Applications/XAMPP/htdocs/`
3. Extract and place the project folder there. We suggest naming it `library-system`.

### Step 2: Establish the Relational Database
1. Launch the **XAMPP Control Panel** and start both the **Apache** and **MySQL** services.
2. Open your browser and navigate to the database manager: `http://localhost/phpmyadmin/`
3. Click on the **New** button in the left sidebar.
4. Input Database Name: `library_db` and click **Create**.
5. Select `library_db` in the sidebar, and navigate to the **Import** tab on the top menu bar.
6. Click **Choose File** and locate the database backup file:
   - `library-system/database/library.sql`
7. Scroll to the bottom and click **Import** (or **Go**). All structural tables and simulated data rows will populate instantly.

### Step 3: Run the Application
1. In your browser, navigate to: `http://localhost/library-system/index.php`
2. Authenticate using the pre-seeded admin credentials:
   - **Admin Email**: `admin@library.com`
   - **Password**: `admin123`
3. Click **Sign In** to log into the main system control panel!

---

## 🎓 Academic Viva-Voce (Project Defense) Preparation Guide

When defending this minor college project to external examiners, you are highly likely to face these technical questions. Use this cheat-sheet to achieve high grades!

### Q1: Why did you choose PHP PDO over mysqli functions?
> **Answer**: PHP Data Objects (PDO) provides a database-neutral abstraction layer. If we decide to migrate our backend from MySQL to PostgreSQL or SQLite in the future, we only need to change the connection string in `config/db.php` rather than rewrites of all query functions. Furthermore, PDO natively supports named parameters and prepared statement parameters binding, which is crucial for modern SQL injection defense.

### Q2: What is "Relational Integrity" and how is it used in this system?
> **Answer**: Relational Integrity ensures consistent data links across tables. For example, in our schema:
> - If an administrator tries to delete a **Student** who currently has books marked as `"Issued"` (outstanding), the system runs an integrity check and rejects the deletion block. This prevents orphaned records (having an issue record referencing a student who doesn't exist anymore).
> - Deleting a **Category** will automatically set the category code inside the corresponding `books` rows to `NULL` (due to foreign key definitions), preserving our inventory without throwing system exceptions.

### Q3: Why did you use Database Transactions during Book Issuance?
> **Answer**: Issuing a book involves two separate database operations: inserting a record into `issued_books` and updating the `available_copies` value inside `books`. If the first query succeeds but the second fails (e.g., due to a network disruption), our inventory counts would desynchronize. Wrapping them in a transaction block ensures **Atomicity (the "A" in ACID)** — either both operations succeed completely, or they both fail and get rolled back.

### Q4: How is security handled on pages like `dashboard.php` if someone directly types the URL?
> **Answer**: All views are guarded with a Session Guard at the very top of each file. If a user tries to access any deep link without an active session, the guard detects the absence of `$_SESSION['admin_id']` and redirects them back to the login gateway `index.php`:
> ```php
> if (!isset($_SESSION['admin_id'])) {
>     header("Location: index.php");
>     exit();
> }
> ```

---

## 📜 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
