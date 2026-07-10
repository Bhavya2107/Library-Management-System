<?php
/**
 * @license Apache-2.0
 * Book Issue / Return Registry
 */
$root_dir = '../';
$base_path = '../';
require_once $root_dir . 'includes/header.php';
require_once $root_dir . 'includes/navbar.php';
require_once $root_dir . 'config/db.php';

// Auth Guard
if (!isset($_SESSION['admin_id'])) {
    header("Location: " . $root_dir . "index.php");
    exit();
}

$success_message = '';
$error_message = '';

// Handle Book Return Request
if (isset($_GET['return_id'])) {
    $issue_id = (int)$_GET['return_id'];

    // Fetch the issue record to confirm state and get book_id
    $chk_stmt = $conn->prepare("SELECT * FROM issued_books WHERE id = ?");
    $chk_stmt->execute([$issue_id]);
    $record = $chk_stmt->fetch();

    if ($record && $record['status'] === 'Issued') {
        try {
            // Begin secure database transaction block
            $conn->beginTransaction();

            // 1. Update issue record to 'Returned'
            $upd_stmt = $conn->prepare("UPDATE issued_books SET status = 'Returned' WHERE id = ?");
            $upd_stmt->execute([$issue_id]);

            // 2. Increment available_copies in books inventory
            $inc_stmt = $conn->prepare("UPDATE books SET available_copies = available_copies + 1 WHERE id = ?");
            $inc_stmt->execute([$record['book_id']]);

            $conn->commit();
            $success_message = "Book return recorded successfully. Inventory stock incremented.";
        } catch (Exception $e) {
            $conn->rollBack();
            $error_message = "Failed to process return. Database Error: " . $e->getMessage();
        }
    } else {
        $error_message = "This record is either invalid or already returned.";
    }
}

// Search Filter
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
if (!empty($search)) {
    $stmt = $conn->prepare("
        SELECT ib.*, s.name AS student_name, s.enrollment_no, b.name AS book_title 
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        WHERE s.name LIKE ? OR b.name LIKE ? OR s.enrollment_no LIKE ? OR ib.status LIKE ?
        ORDER BY ib.id DESC
    ");
    $stmt->execute(["%$search%", "%$search%", "%$search%", "%$search%"]);
} else {
    $stmt = $conn->query("
        SELECT ib.*, s.name AS student_name, s.enrollment_no, b.name AS book_title 
        FROM issued_books ib
        JOIN students s ON ib.student_id = s.id
        JOIN books b ON ib.book_id = b.id
        ORDER BY ib.id DESC
    ");
}
$issues = $stmt->fetchAll();
?>

<div className="container py-5">
    <div className="d-flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-black text-slate-900 mb-0">Lending &amp; Returns Registry</h2>
            <p className="text-muted small">Track outstanding borrowings, check due dates, and update return clearances.</p>
        </div>
        <a href="add.php" className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5 shadow-sm text-xs" style="border-radius:10px; background-color: var(--brand-blue); border:0;">
            <i className="bi bi-arrow-left-right"></i> Issue Book to Student
        </a>
    </div>

    <?php if (!empty($success_message)): ?>
        <div className="alert alert-success d-flex align-items-center gap-2 small rounded-3 py-2.5 mb-4" role="alert">
            <i className="bi bi-check-circle-fill"></i>
            <div><?php echo $success_message; ?></div>
        </div>
    <?php endif; ?>

    <?php if (!empty($error_message)): ?>
        <div className="alert alert-danger d-flex align-items-center gap-2 small rounded-3 py-2.5 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div><?php echo $error_message; ?></div>
        </div>
    <?php endif; ?>

    <!-- Filter Block -->
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <form action="index.php" method="GET" className="row g-3 align-items-center">
            <div className="col-12 col-md-8">
                <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
                    <input type="text" name="search" className="form-control border-start-0" placeholder="Search by Student, Book, Enrollment, or Status (Issued/Returned)..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
            </div>
            <div className="col-12 col-md-4 d-grid gap-2 d-md-flex">
                <button type="submit" className="btn btn-secondary px-4 text-xs" style="border-radius:10px;">Filter Registry</button>
                <?php if (!empty($search)): ?>
                    <a href="index.php" className="btn btn-outline-secondary px-3 text-xs" style="border-radius:10px;">Reset</a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Active Issued List -->
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-4">
        <div className="table-responsive">
            <table className="table align-middle table-hover text-xs mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="py-3 px-3">Issue ID</th>
                        <th className="py-3 px-3">Student Name (Enrollment No)</th>
                        <th className="py-3 px-3">Book Title</th>
                        <th className="py-3 px-3">Issue Date</th>
                        <th className="py-3 px-3">Expected Return Due</th>
                        <th className="py-3 px-3">Lending Status</th>
                        <th className="py-3 px-3 text-end no-print">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($issues as $issue): ?>
                        <tr>
                            <td className="py-3 px-3 font-mono fw-extrabold text-slate-700">#ISS00<?php echo $issue['id']; ?></td>
                            <td className="py-3 px-3">
                                <span className="d-block fw-bold text-slate-800"><?php echo htmlspecialchars($issue['student_name']); ?></span>
                                <span className="font-mono text-muted text-[10px]"><?php echo htmlspecialchars($issue['enrollment_no']); ?></span>
                            </td>
                            <td className="py-3 px-3 text-slate-700" style="max-width: 200px;"><?php echo htmlspecialchars($issue['book_title']); ?></td>
                            <td className="py-3 px-3 text-slate-600"><?php echo $issue['issue_date']; ?></td>
                            <td className="py-3 px-3 text-slate-950 font-bold"><?php echo $issue['return_date']; ?></td>
                            <td className="py-3 px-3">
                                <?php if ($issue['status'] === 'Issued'): ?>
                                    <span className="badge rounded-pill bg-warning-subtle text-warning py-1.5 px-3">Issued</span>
                                <?php else: ?>
                                    <span className="badge rounded-pill bg-success-subtle text-success py-1.5 px-3">Returned &amp; Cleared</span>
                                <?php endif; ?>
                            </td>
                            <td className="py-3 px-3 text-end no-print">
                                <?php if ($issue['status'] === 'Issued'): ?>
                                    <a href="index.php?return_id=<?php echo $issue['id']; ?>" className="btn btn-sm btn-brand px-3 text-[10px] font-bold" onclick="return confirm('Confirm book return for: <?php echo htmlspecialchars($issue['book_title']); ?>?')">
                                        <i className="bi bi-arrow-return-left me-1"></i> Return Book
                                    </a>
                                <?php else: ?>
                                    <span className="text-muted text-[11px] italic"><i className="bi bi-check-all text-success"></i> Cleared</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($issues)): ?>
                        <tr>
                            <td colSpan="7" className="py-5 text-center text-muted">No book borrowings logged in the system registry.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
