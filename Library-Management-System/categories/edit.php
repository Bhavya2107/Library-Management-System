<?php
/**
 * @license Apache-2.0
 * Edit Category Form
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

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit();
}

$cat_id = (int)$_GET['id'];

// Fetch current details
$stmt = $conn->prepare("SELECT * FROM categories WHERE id = ?");
$stmt->execute([$cat_id]);
$category = $stmt->fetch();

if (!$category) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);

    if (!empty($name)) {
        $upd_stmt = $conn->prepare("UPDATE categories SET name = ?, description = ? WHERE id = ?");
        try {
            $upd_stmt->execute([$name, $description, $cat_id]);
            $success_message = "Category details updated successfully!";
            
            // Re-fetch info
            $stmt->execute([$cat_id]);
            $category = $stmt->fetch();
        } catch (PDOException $e) {
            $error_message = "Could not update category. Name might already be registered.";
        }
    } else {
        $error_message = "Category Name is required.";
    }
}
?>

<div className="container py-5">
    <div className="max-w-xl mx-auto">
        <div className="d-flex align-items-center gap-2 mb-4">
            <a href="index.php" className="btn btn-outline-secondary btn-sm rounded-circle px-2.5 py-1.5"><i className="bi bi-arrow-left"></i></a>
            <h3 className="fw-black text-slate-900 mb-0">Modify Category Details</h3>
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

            <form action="edit.php?id=<?php echo $cat_id; ?>" method="POST" className="space-y-4 text-xs">
                <div className="mb-3">
                    <label className="form-label font-bold text-slate-700">Category Name</label>
                    <input type="text" name="name" required className="form-control" placeholder="Name" value="<?php echo htmlspecialchars($category['name']); ?>">
                </div>

                <div className="mb-4">
                    <label className="form-label font-bold text-slate-700">Description</label>
                    <textarea name="description" rows="4" className="form-control" placeholder="Describe section..."><?php echo htmlspecialchars($category['description']); ?></textarea>
                </div>

                <div className="pt-3 flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 text-xs" style="background-color: var(--brand-blue); border-radius:10px;">
                        Update Category
                    </button>
                    <a href="index.php" className="btn btn-light px-4 py-2.5 border text-xs" style="border-radius:10px;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
