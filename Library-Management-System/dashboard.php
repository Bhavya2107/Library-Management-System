<?php
/**
 * @license Apache-2.0
 * Admin Dashboard controller
 */
require_once 'includes/header.php';
require_once 'includes/navbar.php';
require_once 'config/db.php';

// Route Guard
if (!isset($_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

// 1. Fetch Summary Statistics
$total_books_query = $conn->query("SELECT SUM(quantity) AS count FROM books");
$total_books = $total_books_query->fetch()['count'] ?? 0;

$total_students_query = $conn->query("SELECT COUNT(*) AS count FROM students");
$total_students = $total_students_query->fetch()['count'] ?? 0;

$issued_query = $conn->query("SELECT COUNT(*) AS count FROM issued_books WHERE status = 'Issued'");
$issued_books = $issued_query->fetch()['count'] ?? 0;

$returned_query = $conn->query("SELECT COUNT(*) AS count FROM issued_books WHERE status = 'Returned'");
$returned_books = $returned_query->fetch()['count'] ?? 0;

$available_query = $conn->query("SELECT SUM(available_copies) AS count FROM books");
$available_copies = $available_query->fetch()['count'] ?? 0;

// 2. Fetch Recent Transactions
$recent_stmt = $conn->query("
    SELECT ib.*, s.name AS student_name, b.name AS book_title 
    FROM issued_books ib
    JOIN students s ON ib.student_id = s.id
    JOIN books b ON ib.book_id = b.id
    ORDER BY ib.id DESC LIMIT 5
");
$recent_issues = $recent_stmt->fetchAll();
?>

<div className="container py-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="fw-black text-slate-900 mb-0">Dashboard Overview</h2>
            <p className="text-muted small">Welcome back, Librarian <strong><?php echo htmlspecialchars($_SESSION['admin_name']); ?></strong>.</p>
        </div>
        <div className="text-muted small"><i className="bi bi-clock me-1 text-primary"></i> Live Core Session</div>
    </div>

    <!-- Summary Cards Grid -->
    <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 card-stats bg-white">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 me-3">
                        <i className="bi bi-bookshelf fs-3"></i>
                    </div>
                    <div>
                        <span className="text-muted small fw-semibold text-uppercase tracking-wider">Total Books Volume</span>
                        <h3 className="fw-black text-slate-900 mb-0 mt-1"><?php echo $total_books; ?></h3>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 card-stats bg-white">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-4 me-3">
                        <i className="bi bi-people-fill fs-3"></i>
                    </div>
                    <div>
                        <span className="text-muted small fw-semibold text-uppercase tracking-wider">Registered Students</span>
                        <h3 className="fw-black text-slate-900 mb-0 mt-1"><?php echo $total_students; ?></h3>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 card-stats bg-white">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-4 me-3">
                        <i className="bi bi-calendar-check fs-3"></i>
                    </div>
                    <div>
                        <span className="text-muted small fw-semibold text-uppercase tracking-wider">Books Borrowed</span>
                        <h3 className="fw-black text-slate-900 mb-0 mt-1"><?php echo $issued_books; ?></h3>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 card-stats bg-white">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-info bg-opacity-10 text-info p-3 rounded-4 me-3">
                        <i className="bi bi-check-circle-fill fs-3"></i>
                    </div>
                    <div>
                        <span className="text-muted small fw-semibold text-uppercase tracking-wider">Returned & Cleaned</span>
                        <h3 className="fw-black text-slate-900 mb-0 mt-1"><?php echo $returned_books; ?></h3>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100 card-stats bg-white">
                <div className="card-body d-flex align-items-center p-4">
                    <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-4 me-3">
                        <i className="bi bi-book-half fs-3"></i>
                    </div>
                    <div>
                        <span className="text-muted small fw-semibold text-uppercase tracking-wider">Available Instock</span>
                        <h3 className="fw-black text-slate-900 mb-0 mt-1 text-success"><?php echo $available_copies; ?></h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Operations & Recent activity row -->
    <div className="row g-4">
        <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Recent Library Transactions</h5>
                    <a href="issue/index.php" className="text-decoration-none small text-primary fw-semibold">View Master Log &rarr;</a>
                </div>
                <div className="table-responsive">
                    <table className="table align-middle table-hover text-xs mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 px-3">Issue ID</th>
                                <th className="py-3 px-3">Student Name</th>
                                <th className="py-3 px-3">Book Title</th>
                                <th className="py-3 px-3">Issue Date</th>
                                <th className="py-3 px-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($recent_issues as $issue): ?>
                                <tr>
                                    <td className="py-3 px-3 font-mono text-muted">#ISS00<?php echo $issue['id']; ?></td>
                                    <td className="py-3 px-3 fw-bold"><?php echo htmlspecialchars($issue['student_name']); ?></td>
                                    <td className="py-3 px-3 text-truncate" style="max-width: 200px;"><?php echo htmlspecialchars($issue['book_title']); ?></td>
                                    <td className="py-3 px-3 text-muted"><?php echo $issue['issue_date']; ?></td>
                                    <td className="py-3 px-3">
                                        <span className="badge rounded-pill <?php echo $issue['status'] === 'Issued' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'; ?> px-3 py-2 small">
                                            <?php echo $issue['status']; ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php if (empty($recent_issues)): ?>
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-muted">No pending or historical book issues found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                <h5 className="fw-bold mb-4">Core Actions Portal</h5>
                <div className="d-grid gap-3">
                    <a href="issue/add.php" className="btn btn-light border-0 d-flex align-items-center justify-content-between p-3 rounded-3 text-start hover-shadow transition text-decoration-none">
                        <div>
                            <span className="fw-bold text-dark d-block text-xs">Issue New Book</span>
                            <span className="text-muted text-[11px]">Lend to a student</span>
                        </div>
                        <i className="bi bi-plus-circle text-primary fs-4"></i>
                    </a>

                    <a href="books/add.php" className="btn btn-light border-0 d-flex align-items-center justify-content-between p-3 rounded-3 text-start hover-shadow transition text-decoration-none">
                        <div>
                            <span className="fw-bold text-dark d-block text-xs">Inventory Intake</span>
                            <span className="text-muted text-[11px]">Register new ISBN book</span>
                        </div>
                        <i className="bi bi-book text-success fs-4"></i>
                    </a>

                    <a href="students/add.php" className="btn btn-light border-0 d-flex align-items-center justify-content-between p-3 rounded-3 text-start hover-shadow transition text-decoration-none">
                        <div>
                            <span className="fw-bold text-dark d-block text-xs">Register Student</span>
                            <span className="text-muted text-[11px]">Add student enrollment</span>
                        </div>
                        <i className="bi bi-person-plus text-info fs-4"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
