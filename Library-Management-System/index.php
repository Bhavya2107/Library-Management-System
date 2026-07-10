<?php
/**
 * @license Apache-2.0
 * Login system for Admin portal
 */
require_once 'includes/header.php';
require_once 'config/db.php';

// Redirect to dashboard if session is already active
if (isset($_SESSION['admin_id'])) {
    header("Location: dashboard.php");
    exit();
}

$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (!empty($email) && !empty($password)) {
        // Secure prepared statement to prevent SQL Injection
        $stmt = $conn->prepare("SELECT * FROM admin_users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            // Setup Session variables
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['name'];
            $_SESSION['admin_email'] = $admin['email'];
            $_SESSION['admin_photo'] = $admin['photo_url'];

            header("Location: dashboard.php");
            exit();
        } else {
            $error_message = "Invalid email address or password.";
        }
    } else {
        $error_message = "Please fill in all details.";
    }
}
?>

<div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card border-0 shadow-lg p-4" style="width: 25rem; border-radius: 18px;">
        <div className="card-body">
            <div className="text-center mb-4">
                <div className="bg-primary text-white d-inline-flex p-3 rounded-3 mb-3 shadow-sm">
                    <i className="bi bi-book-half fs-2"></i>
                </div>
                <h4 className="fw-extrabold mb-1">Library System</h4>
                <p className="text-muted small">Admin Control Panel Portal</p>
            </div>

            <?php if (!empty($error_message)): ?>
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small rounded-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div><?php echo htmlspecialchars($error_message); ?></div>
                </div>
            <?php endif; ?>

            <form action="index.php" method="POST" className="space-y-4">
                <div className="mb-3">
                    <label className="form-label small fw-bold">Admin Email</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                        <input type="email" name="email" required className="form-control border-start-0" placeholder="admin@library.com">
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label small fw-bold">Secret Password</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                        <input type="password" name="password" required className="form-control border-start-0" placeholder="••••••••">
                    </div>
                    <div className="form-text text-end mt-1 small text-muted">
                        Default ID: <strong>admin@library.com</strong> / password: <strong>admin123</strong>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2.5 fw-semibold border-0 shadow-sm" style="background-color: var(--brand-blue); border-radius: 12px;">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In to Library
                </button>
            </form>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
