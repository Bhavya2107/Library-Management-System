<?php
/**
 * @license Apache-2.0
 * Change Password module with secure hashing
 */
require_once 'includes/header.php';
require_once 'includes/navbar.php';
require_once 'config/db.php';

// Auth Guard
if (!isset($_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

$admin_id = $_SESSION['admin_id'];
$success_message = '';
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old_pass = $_POST['old_password'];
    $new_pass = $_POST['new_password'];
    $confirm_pass = $_POST['confirm_password'];

    if (!empty($old_pass) && !empty($new_pass) && !empty($confirm_pass)) {
        if ($new_pass !== $confirm_pass) {
            $error_message = "New password and confirmation do not match.";
        } elseif (strlen($new_pass) < 6) {
            $error_message = "New password must be at least 6 characters long.";
        } else {
            // Fetch current password
            $stmt = $conn->prepare("SELECT password FROM admin_users WHERE id = ?");
            $stmt->execute([$admin_id]);
            $hash = $stmt->fetchColumn();

            if (password_verify($old_pass, $hash)) {
                // Securely hash the new password using native bcrypt
                $new_hash = password_hash($new_pass, PASSWORD_BCRYPT);
                
                $update_stmt = $conn->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
                $update_stmt->execute([$new_hash, $admin_id]);
                
                $success_message = "Your password has been changed successfully!";
            } else {
                $error_message = "Current password is incorrect.";
            }
        }
    } else {
        $error_message = "All password fields are required.";
    }
}
?>

<div className="container py-5">
    <div className="max-w-md mx-auto">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h4 className="fw-black text-slate-900 mb-2">Change Password</h4>
            <p className="text-muted small mb-4">Secure your administrator session. Avoid using generic phrases.</p>

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

            <form action="change_password.php" method="POST" className="space-y-4">
                <div className="mb-3">
                    <label className="form-label small fw-bold">Current Password</label>
                    <input type="password" name="old_password" required className="form-control" placeholder="••••••••">
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold">New Password</label>
                    <input type="password" name="new_password" required className="form-control" placeholder="Minimum 6 characters">
                </div>

                <div className="mb-4">
                    <label className="form-label small fw-bold">Confirm New Password</label>
                    <input type="password" name="confirm_password" required className="form-control" placeholder="Re-enter new password">
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2.5 fw-semibold border-0 shadow-sm text-xs" style="background-color: var(--brand-blue); border-radius: 10px;">
                    <i className="bi bi-shield-lock me-1"></i> Update Security Credentials
                </button>
            </form>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
