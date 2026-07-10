<?php
/**
 * @license Apache-2.0
 * Edit Book Form
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

$book_id = $_GET['id'];

// Fetch Book details
$stmt = $conn->prepare("SELECT * FROM books WHERE id = ?");
$stmt->execute([$book_id]);
$book = $stmt->fetch();

if (!$book) {
    header("Location: index.php");
    exit();
}

// Fetch Categories for select list
$categories = $conn->query("SELECT id, name FROM categories ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $author = trim($_POST['author']);
    $category_id = $_POST['category_id'] ? (int)$_POST['category_id'] : null;
    $publisher = trim($_POST['publisher']);
    $isbn = trim($_POST['isbn']);
    $quantity = (int)$_POST['quantity'];
    $shelf_number = trim($_POST['shelf_number']);

    if (!empty($name) && !empty($author) && !empty($isbn) && $quantity >= 0) {
        // Calculate updated available copies based on total quantity difference
        $diff = $quantity - $book['quantity'];
        $new_available = max(0, $book['available_copies'] + $diff);

        // Prepared statement to prevent SQL Injection
        $upd_stmt = $conn->prepare("
            UPDATE books 
            SET name = ?, author = ?, category_id = ?, publisher = ?, isbn = ?, quantity = ?, available_copies = ?, shelf_number = ?
            WHERE id = ?
        ");
        
        try {
            $upd_stmt->execute([$name, $author, $category_id, $publisher, $isbn, $quantity, $new_available, $shelf_number, $book_id]);
            $success_message = "Book information updated successfully!";
            
            // Re-fetch details
            $stmt->execute([$book_id]);
            $book = $stmt->fetch();
        } catch (PDOException $e) {
            $error_message = "Failed to update book record. Error: " . $e->getMessage();
        }
    } else {
        $error_message = "Please fill in all required fields.";
    }
}
?>

<div className="container py-5">
    <div className="max-w-xl mx-auto">
        <div className="d-flex align-items-center gap-2 mb-4">
            <a href="index.php" className="btn btn-outline-secondary btn-sm rounded-circle px-2.5 py-1.5"><i className="bi bi-arrow-left"></i></a>
            <h3 className="fw-black text-slate-900 mb-0">Edit Book Record</h3>
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

            <form action="edit.php?id=<?php echo urlencode($book_id); ?>" method="POST" className="space-y-4 text-xs">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Book ID (Primary Key)</label>
                        <input type="text" disabled className="form-control font-mono bg-light" value="<?php echo htmlspecialchars($book['id']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">ISBN Number</label>
                        <input type="text" name="isbn" required className="form-control font-mono" placeholder="ISBN" value="<?php echo htmlspecialchars($book['isbn']); ?>">
                    </div>

                    <div className="col-12">
                        <label className="form-label font-bold text-slate-700">Book Title Name</label>
                        <input type="text" name="name" required className="form-control" placeholder="Book title" value="<?php echo htmlspecialchars($book['name']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Author Name</label>
                        <input type="text" name="author" required className="form-control" placeholder="Author's name" value="<?php echo htmlspecialchars($book['author']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Publisher</label>
                        <input type="text" name="publisher" required className="form-control" placeholder="Publisher" value="<?php echo htmlspecialchars($book['publisher']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Category</label>
                        <select name="category_id" className="form-select">
                            <option value="">-- Choose Category --</option>
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?php echo $cat['id']; ?>" <?php echo $book['category_id'] == $cat['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($cat['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div className="col-12 col-md-3">
                        <label className="form-label font-bold text-slate-700">Total Quantity</label>
                        <input type="number" name="quantity" required min="1" className="form-control" value="<?php echo htmlspecialchars($book['quantity']); ?>">
                    </div>

                    <div className="col-12 col-md-3">
                        <label className="form-label font-bold text-slate-700">Shelf Number</label>
                        <input type="text" name="shelf_number" required className="form-control font-mono" placeholder="e.g. A-12" value="<?php echo htmlspecialchars($book['shelf_number']); ?>">
                    </div>
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 text-xs" style="background-color: var(--brand-blue); border-radius:10px;">
                        Update Book Info
                    </button>
                    <a href="index.php" className="btn btn-light px-4 py-2.5 border text-xs" style="border-radius:10px;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
