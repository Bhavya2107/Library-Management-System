# Library Management System - Minor College Project

An elegant, highly secure, and responsive web application built specifically for college course evaluations (suitable for BCA, MCA, Diploma, and Computer Engineering students). 

Developed strictly using **Core PHP**, **MySQL**, **HTML5**, **CSS3**, **JavaScript**, and **Bootstrap 5**, with absolutely zero third-party frameworks, composer packages, or heavy external dependencies.

---

## Technical Specifications

- **Backend Logic**: Core PHP (Procedural with PDO prepared queries)
- **Database Engine**: MySQL / MariaDB (relational with cascade foreign keys)
- **User Interface**: HTML5, custom CSS3 variables, and Bootstrap 5 CDN
- **Security Features**: Native password hashing (`PASSWORD_BCRYPT`), prepared statements, session verification, input sanitization, and CSRF protection.

---

## Workspace Directory Tree

```text
Library-Management-System/
├── config/
│   └── db.php                  # PDO database connection configurations
├── database/
│   └── library.sql             # SQL database script with mock schema & values
├── includes/
│   ├── header.php              # Global HTML headers and CSS imports
│   ├── navbar.php              # Bootstrap 5 responsive navigation menu
│   └── footer.php              # Shared footers and Bootstrap JS imports
├── books/
│   ├── index.php               # Book inventory database table (CRUD list)
│   ├── add.php                 # Intake form for new book titles
│   └── edit.php                # Modifier form for existing book parameters
├── students/
│   ├── index.php               # Student membership table with validation guards
│   ├── add.php                 # Student registration form
│   └── edit.php                # Student record modifier form
├── categories/
│   ├── index.php               # Book category catalog with descriptions
│   ├── add.php                 # Category creation form
│   └── edit.php                # Category modifier form
├── issue/
│   ├── index.php               # Lending registry and book return managers
│   └── add.php                 # Transaction system with dynamic stock deduction
├── index.php                   # Portal login view (Admin authentication entry)
├── dashboard.php               # Core analytical dashboard with action panels
├── profile.php                 # Admin personal file manager
├── change_password.php         # Secure password modifier module
└── logout.php                  # Session destruction script
```

---

## Default Administrative Credentials

- **Admin Account**: `admin@library.com`
- **Password**: `admin123`
- **Role Permissions**: Head Librarian / System Admin

---

## Installation Guide (Localhost with XAMPP)

Follow these simple steps to host this project on your personal machine for demonstration:

### Step 1: Copy Files to Server Root
1. Install and boot **XAMPP** (or WampServer).
2. Download or export the project files ZIP.
3. Extract the folder and rename it to `library-system`.
4. Copy the entire folder and paste it into the XAMPP directory:
   - On Windows: `C:\xampp\htdocs\library-system\`
   - On macOS: `/Applications/XAMPP/htdocs/library-system/`

### Step 2: Set Up MySQL Database
1. Open your browser and navigate to the database manager: `http://localhost/phpmyadmin/`
2. Click **New** in the left navigation sidebar.
3. Enter Database Name: `library_db` and click **Create**.
4. Select the newly created `library_db` in the sidebar, then go to the **Import** tab at the top.
5. Click **Choose File** and select the database file located at: `library-system/database/library.sql`
6. Scroll to the bottom and click **Import** (or **Go**). All tables and mock values will populate instantly.

### Step 3: Run the Application
1. Start your browser.
2. Go to: `http://localhost/library-system/index.php`
3. Enter default credentials:
   - **Email**: `admin@library.com`
   - **Password**: `admin123`
4. Click **Sign In** to access the system dashboard!

---

## Key Performance Standards & Security Highlights

1. **SQL Injection Block**: Uses PHP PDO prepared parameter bindings exclusively, preventing any SQL Injection attacks.
2. **Business Flow Verification**: Prevents deleting students with active unreturned books or deleting books with copies still in hands of active borrowers.
3. **Atomic Transactions**: Processes issuing or returning books inside atomic database transaction locks (`beginTransaction`, `commit`, `rollBack`), preventing any desynchronization of book inventory stock levels.
4. **Intuitive UX**: Simple layout, white-blue-gray visual palette, and clean typography designed to score highly with external examiners.
