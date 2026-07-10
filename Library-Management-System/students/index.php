<?php
/**
 * @license Apache-2.0
 * Manage Students Index View
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

// Process Student Deletion
if (isset($_GET['delete'])) {
    $student_id = $_GET['delete'];

    // Verify if student has any books currently issued (unreturned)
    $stmt_check = $conn->prepare("SELECT COUNT(*) FROM issued_books WHERE student_id = ? AND status = 'Issued'");
    $stmt_check->execute([$student_id]);
    
    if ($stmt_check->fetchColumn() > 0) {
        $error_message = "Cannot remove student. They have outstanding books that must be returned first!";
    } else {
        $stmt_del = $conn->prepare("DELETE FROM students WHERE id = ?");
        $stmt_del->execute([$student_id]);
        $success_message = "Student ID " . htmlspecialchars($student_id) . " records removed successfully.";
    }
}

// Search Filter
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
if (!empty($search)) {
    $stmt = $conn->prepare("
        SELECT * FROM students 
        WHERE id LIKE ? OR name LIKE ? OR enrollment_no LIKE ? OR course LIKE ?
        ORDER BY name ASC
    ");
    $stmt->execute(["%$search%", "%$search%", "%$search%", "%$search%"]);
} else {
    $stmt = $conn->query("SELECT * FROM students ORDER BY name ASC");
}
$students = $stmt->fetchAll();
?>

<div className="container py-5">
    <div className="d-flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-black text-slate-900 mb-0">Student Registry Directory</h2>
            <p className="text-muted small">Configure courses, search enrollment records, and manage student profiles.</p>
        </div>
        <a href="add.php" className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5 shadow-sm text-xs" style="border-radius:10px; background-color: var(--brand-blue); border:0;">
            <i className="bi bi-person-plus"></i> Register Student
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
                    <input type="text" name="search" className="form-control border-start-0" placeholder="Search by Student ID, Name, Enrollment, Course..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
            </div>
            <div className="col-12 col-md-4 d-grid gap-2 d-md-flex">
                <button type="submit" className="btn btn-secondary px-4 text-xs" style="border-radius:10px;">Filter Directory</button>
                <?php if (!empty($search)): ?>
                    <a href="index.php" className="btn btn-outline-secondary px-3 text-xs" style="border-radius:10px;">Reset</a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Student Table Grid -->
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-4">
        <div className="table-responsive">
            <table className="table align-middle table-hover text-xs mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="py-3 px-3">Student ID</th>
                        <th className="py-3 px-3">Full Name</th>
                        <th className="py-3 px-3">Enrollment Number</th>
                        <th className="py-3 px-3">Course Details</th>
                        <th className="py-3 px-3">Email Address</th>
                        <th className="py-3 px-3">Contact Phone</th>
                        <th className="py-3 px-3">Residential Address</th>
                        <th className="py-3 px-3 text-end no-print">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($students as $student): ?>
                        <tr>
                            <td className="py-3 px-3 font-mono fw-extrabold text-slate-700"><?php echo htmlspecialchars($student['id']); ?></td>
                            <td className="py-3 px-3 font-semibold text-slate-900"><?php echo htmlspecialchars($student['name']); ?></td>
                            <td className="py-3 px-3 font-mono text-muted"><?php echo htmlspecialchars($student['enrollment_no']); ?></td>
                            <td className="py-3 px-3">
                                <span className="badge bg-secondary-subtle text-secondary px-2 py-1.5 rounded-2"><?php echo htmlspecialchars($student['course']); ?></span>
                                <span className="text-slate-400 ms-1 small">Sem <?php echo htmlspecialchars($student['semester']); ?></span>
                            </td>
                            <td className="py-3 px-3 text-slate-600"><?php echo htmlspecialchars($student['email']); ?></td>
                            <td className="py-3 px-3 text-slate-600"><?php echo htmlspecialchars($student['phone']); ?></td>
                            <td className="py-3 px-3 text-muted text-truncate" style="max-width: 150px;"><?php echo htmlspecialchars($student['address']); ?></td>
                            <td className="py-3 px-3 text-end no-print">
                                <div className="d-flex justify-content-end gap-2">
                                    <a href="edit.php?id=<?php echo urlencode($student['id']); ?>" className="btn btn-sm btn-outline-secondary px-2.5 rounded-3" title="Edit Profile">
                                        <i className="bi bi-pencil"></i>
                                    </a>
                                    <a href="index.php?delete=<?php echo urlencode($student['id']); ?>" className="btn btn-sm btn-outline-danger px-2.5 rounded-3" onclick="return confirm('Remove student record for <?php echo htmlspecialchars($student['name']); ?>?')" title="Delete">
                                        <i className="bi bi-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($students)): ?>
                        <tr>
                            <td colSpan="8" className="py-5 text-center text-muted">No student profiles registered. Use Add Student to create.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
