<?php
/**
 * @license Apache-2.0
 * Issue Book Form
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

$error_message = '';
$success_message = '';

// Fetch all registered students
$students = $conn->query("SELECT id, name, enrollment_no FROM students ORDER BY name ASC")->fetchAll();

// Fetch books that have available copies
$books = $conn->query("SELECT id, name, available_copies, shelf_number FROM books WHERE available_copies > 0 ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $student_id = trim($_POST['student_id']);
    $book_id = trim($_POST['book_id']);
    $issue_date = $_POST['issue_date'];
    $return_date = $_POST['return_date'];

    if (!empty($student_id) && !empty($book_id) && !empty($issue_date) && !empty($return_date)) {
        // Double check available copies in database
        $chk_stmt = $conn->prepare("SELECT available_copies FROM books WHERE id = ?");
        $chk_stmt->execute([$book_id]);
        $avail = $chk_stmt->fetchColumn();

        if ($avail <= 0) {
            $error_message = "Selected book is currently out of stock!";
        } else {
            try {
                // Begin atomic transaction
                $conn->beginTransaction();

                // 1. Insert transaction row in issued_books
                $ins_stmt = $conn->prepare("
                    INSERT INTO issued_books (student_id, book_id, issue_date, return_date, status)
                    VALUES (?, ?, ?, ?, 'Issued')
                ");
                $ins_stmt->execute([$student_id, $book_id, $issue_date, $return_date]);

                // 2. Decrement available_copies of book
                $dec_stmt = $conn->prepare("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?");
                $dec_stmt->execute([$book_id]);

                $conn->commit();
                $success_message = "Book successfully issued to student!";
                
                // Re-fetch books to update dropdown list state
                $books = $conn->query("SELECT id, name, available_copies, shelf_number FROM books WHERE available_copies > 0 ORDER BY name ASC")->fetchAll();
            } catch (Exception $e) {
                $conn->rollBack();
                $error_message = "Failed to issue book. Database Error: " . $e->getMessage();
            }
        }
    } else {
        $error_message = "Please select both a student, a book, and expected dates.";
    }
}
?>

<div className="container py-5">
    <div className="max-w-xl mx-auto">
        <div className="d-flex align-items-center gap-2 mb-4">
            <a href="index.php" className="btn btn-outline-secondary btn-sm rounded-circle px-2.5 py-1.5"><i className="bi bi-arrow-left"></i></a>
            <h3 className="fw-black text-slate-900 mb-0">Issue Book to Student</h3>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <?php if (!empty($error_message)): ?>
                <div className="alert alert-danger rounded-3 py-2.5 small mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($success_message)): ?>
                <div className="alert alert-success rounded-3 py-2.5 small mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i> <?php echo htmlspecialchars($success_message); ?>
                </div>
            <?php endif; ?>

            <form action="add.php" method="POST" className="space-y-4 text-xs">
                
                <div className="mb-3">
                    <label className="form-label font-bold text-slate-700">Select Student Profile</label>
                    <select name="student_id" required className="form-select">
                        <option value="">-- Choose Student --</option>
                        <?php foreach ($students as $stu): ?>
                            <option value="<?php echo $stu['id']; ?>" <?php echo (isset($_POST['student_id']) && $_POST['student_id'] === $stu['id']) ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($stu['name']); ?> (Enrollment: <?php echo htmlspecialchars($stu['enrollment_no']); ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label font-bold text-slate-700">Select Available Book Title</label>
                    <select name="book_id" required className="form-select">
                        <option value="">-- Choose Book --</option>
                        <?php foreach ($books as $bk): ?>
                            <option value="<?php echo $bk['id']; ?>" <?php echo (isset($_POST['book_id']) && $_POST['book_id'] === $bk['id']) ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($bk['name']); ?> (Copies: <?php echo $bk['available_copies']; ?> • Shelf: <?php echo htmlspecialchars($bk['shelf_number']); ?>)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Issue Date</label>
                        <input type="date" name="issue_date" required className="form-control" value="<?php echo htmlspecialchars($_POST['issue_date'] ?? date('Y-m-d')); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Return Due Date</label>
                        <input type="date" name="return_date" required className="form-control" value="<?php echo htmlspecialchars($_POST['return_date'] ?? date('Y-m-d', strtotime('+14 days'))); ?>">
                    </div>
                </div>

                <div className="pt-3 flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 text-xs" style="background-color: var(--brand-blue); border-radius:10px;">
                        Issue Book Now
                    </button>
                    <a href="index.php" className="btn btn-light px-4 py-2.5 border text-xs" style="border-radius:10px;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
