<?php
/**
 * @license Apache-2.0
 * Book Categories List
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

// Handle category deletion
if (isset($_GET['delete'])) {
    $cat_id = (int)$_GET['delete'];
    
    // Delete target category row
    $del_stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    try {
        $del_stmt->execute([$cat_id]);
        $success_message = "Category removed successfully. Connected books have had their category reference cleared.";
    } catch (PDOException $e) {
        $error_message = "Could not delete category: " . $e->getMessage();
    }
}

// Search Filter
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
if (!empty($search)) {
    $stmt = $conn->prepare("SELECT * FROM categories WHERE name LIKE ? ORDER BY name ASC");
    $stmt->execute(["%$search%"]);
} else {
    $stmt = $conn->query("SELECT * FROM categories ORDER BY name ASC");
}
$categories = $stmt->fetchAll();
?>

<div className="container py-5">
    <div className="d-flex flex-col sm:flex-row justify-content-between align-items-start sm:align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-black text-slate-900 mb-0">Book Categories</h2>
            <p className="text-muted small">Configure catalogue groups to organize your library stacks.</p>
        </div>
        <a href="add.php" className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5 shadow-sm text-xs" style="border-radius:10px; background-color: var(--brand-blue); border:0;">
            <i className="bi bi-tag"></i> Add Category
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
                    <input type="text" name="search" className="form-control border-start-0" placeholder="Search by Category Name..." value="<?php echo htmlspecialchars($search); ?>">
                </div>
            </div>
            <div className="col-12 col-md-4 d-grid gap-2 d-md-flex">
                <button type="submit" className="btn btn-secondary px-4 text-xs" style="border-radius:10px;">Filter Categories</button>
                <?php if (!empty($search)): ?>
                    <a href="index.php" className="btn btn-outline-secondary px-3 text-xs" style="border-radius:10px;">Reset</a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Category Grid -->
    <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div className="table-responsive">
            <table className="table align-middle table-hover text-xs mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="py-3 px-4" style="width: 100px;">ID</th>
                        <th className="py-3 px-4" style="width: 250px;">Category Name</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-end no-print" style="width: 150px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($categories as $cat): ?>
                        <tr>
                            <td className="py-3 px-4 font-mono text-muted">#CAT<?php echo $cat['id']; ?></td>
                            <td className="py-3 px-4 font-bold text-slate-800"><?php echo htmlspecialchars($cat['name']); ?></td>
                            <td className="py-3 px-4 text-slate-600"><?php echo htmlspecialchars($cat['description']); ?></td>
                            <td className="py-3 px-4 text-end no-print">
                                <div className="d-flex justify-content-end gap-2">
                                    <a href="edit.php?id=<?php echo urlencode($cat['id']); ?>" className="btn btn-sm btn-outline-secondary px-2.5 rounded-3" title="Edit">
                                        <i className="bi bi-pencil"></i>
                                    </a>
                                    <a href="index.php?delete=<?php echo urlencode($cat['id']); ?>" className="btn btn-sm btn-outline-danger px-2.5 rounded-3" onclick="return confirm('Remove category: <?php echo htmlspecialchars($cat['name']); ?>?')" title="Delete">
                                        <i className="bi bi-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($categories)): ?>
                        <tr>
                            <td colSpan="4" className="py-5 text-center text-muted">No categories created.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
