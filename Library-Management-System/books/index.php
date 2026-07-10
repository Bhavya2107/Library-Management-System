<?php
/**
 * @license Apache-2.0
 * Manage Books Controller & Index View
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

// Handle Delete Book Request
if (isset($_GET['delete'])) {
    $book_id = $_GET['delete'];
    
    // Check if book has outstanding issues
    $check_stmt = $conn->prepare("SELECT COUNT(*) FROM issued_books WHERE book_id = ? AND status = 'Issued'");
    $check_stmt->execute([$book_id]);
    if ($check_stmt->fetchColumn() > 0) {
        $error_message = "Cannot delete book. Copies are currently issued to students!";
    } else {
        $del_stmt = $conn->prepare("DELETE FROM books WHERE id = ?");
        $del_stmt->execute([$book_id]);
        $success_message = "Book ID " . htmlspecialchars($book_id) . " deleted successfully.";
    }
}

// Search Filter
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
if (!empty($search)) {
    $stmt = $conn->prepare("
        SELECT b.*, c.name AS category_name 
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.id LIKE ? OR b.name LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?
        ORDER BY b.name ASC
    ");
    $stmt->execute(["%$search%", "%$search%", "%$search%", "%$search%"]);
} else {
    $stmt = $conn->query("
        SELECT b.*, c.name AS category_name 
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        ORDER BY b.name ASC
    ");
}
$books = $stmt->fetchAll();
?>

<div className="container py-5">
    <div className="d-flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-black text-slate-900 mb-0">Manage Book Inventory</h2>
            <p className="text-muted small">Update volumes, track shelves, and manage ISBN copies.</p>
        </div>
        <a href="add.php" className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5 shadow-sm text-xs" style="border-radius:10px; background-color: var(--brand-blue); border:0;">
            <i className="bi bi-plus-lg"></i> Add New Book Title
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

    <!-- Search Controls -->
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <form action="index.php" method="GET" className="row g-3 align-items-center">
            <div className="col-12 col-md-8">
                <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
                    <input type="text" name="search" className="form-control border-start-0" placeholder="Search by Book ID, Name, Author, ISBN..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
            </div>
            <div className="col-12 col-md-4 d-grid gap-2 d-md-flex">
                <button type="submit" className="btn btn-secondary px-4 text-xs" style="border-radius:10px;">Filter Results</button>
                <?php if (!empty($search)): ?>
                    <a href="index.php" className="btn btn-outline-secondary px-3 text-xs" style="border-radius:10px;">Reset</a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Inventory Data Table -->
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-4">
        <div className="table-responsive">
            <table className="table align-middle table-hover text-xs mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="py-3 px-3">Book ID</th>
                        <th className="py-3 px-3">Book Title</th>
                        <th className="py-3 px-3">Author / Publisher</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">ISBN</th>
                        <th className="py-3 px-3 text-center">Total / Avail</th>
                        <th className="py-3 px-3">Shelf</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-end no-print">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($books as $book): ?>
                        <tr>
                            <td className="py-3 px-3 font-mono fw-extrabold text-slate-700"><?php echo htmlspecialchars($book['id']); ?></td>
                            <td className="py-3 px-3 font-semibold text-slate-900" style="max-width: 200px;"><?php echo htmlspecialchars($book['name']); ?></td>
                            <td className="py-3 px-3">
                                <span className="d-block text-dark"><?php echo htmlspecialchars($book['author']); ?></span>
                                <span className="text-muted text-[10px]"><?php echo htmlspecialchars($book['publisher']); ?></span>
                            </td>
                            <td className="py-3 px-3 text-muted"><?php echo htmlspecialchars($book['category_name'] ?? 'General'); ?></td>
                            <td className="py-3 px-3 font-mono text-muted"><?php echo htmlspecialchars($book['isbn']); ?></td>
                            <td className="py-3 px-3 text-center">
                                <span className="fw-semibold text-slate-800"><?php echo $book['quantity']; ?></span>
                                <span className="text-slate-300 mx-1">/</span>
                                <span className="fw-bold text-primary"><?php echo $book['available_copies']; ?></span>
                            </td>
                            <td className="py-3 px-3 font-mono text-muted"><?php echo htmlspecialchars($book['shelf_number']); ?></td>
                            <td className="py-3 px-3">
                                <?php if ($book['available_copies'] > 0): ?>
                                    <span className="badge rounded-pill bg-success-subtle text-success py-1.5 px-3">Available</span>
                                <?php else: ?>
                                    <span className="badge rounded-pill bg-danger-subtle text-danger py-1.5 px-3">Out of Stock</span>
                                <?php endif; ?>
                            </td>
                            <td className="py-3 px-3 text-end no-print">
                                <div className="d-flex justify-content-end gap-2">
                                    <a href="edit.php?id=<?php echo urlencode($book['id']); ?>" className="btn btn-sm btn-outline-secondary px-2.5 rounded-3" title="Edit Book">
                                        <i className="bi bi-pencil"></i>
                                    </a>
                                    <a href="index.php?delete=<?php echo urlencode($book['id']); ?>" className="btn btn-sm btn-outline-danger px-2.5 rounded-3" onclick="return confirm('Confirm permanent deletion of book: <?php echo htmlspecialchars($book['name']); ?>?')" title="Delete">
                                        <i className="bi bi-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($books)): ?>
                        <tr>
                            <td colSpan="9" className="py-5 text-center text-muted">No books registered matching the filter request.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
