<?php
/**
 * @license Apache-2.0
 * Admin Profile view/edit module
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

// Fetch current info
$stmt = $conn->prepare("SELECT * FROM admin_users WHERE id = ?");
$stmt->execute([$admin_id]);
$admin = $stmt->fetch();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $photo_url = trim($_POST['photo_url']);

    if (!empty($name) && !empty($email)) {
        // Secure prepared statement for update
        $update_stmt = $conn->prepare("UPDATE admin_users SET name = ?, email = ?, photo_url = ? WHERE id = ?");
        
        try {
            $update_stmt->execute([$name, $email, $photo_url, $admin_id]);
            
            // Sync session variables
            $_SESSION['admin_name'] = $name;
            $_SESSION['admin_email'] = $email;
            $_SESSION['admin_photo'] = $photo_url;
            
            $success_message = "Admin profile updated successfully!";
            
            // Re-fetch updated details
            $stmt->execute([$admin_id]);
            $admin = $stmt->fetch();
        } catch (PDOException $e) {
            $error_message = "Could not update profile. Email might already be taken.";
        }
    } else {
        $error_message = "Name and Email are required fields.";
    }
}
?>

<div className="container py-5">
    <div className="max-w-2xl mx-auto">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h3 className="fw-black text-slate-900 mb-4">My Account Profile</h3>

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

            <div className="d-flex align-items-center gap-4 pb-4 mb-4 border-bottom">
                <img src="<?php echo htmlspecialchars($admin['photo_url']); ?>" className="rounded-circle border border-primary shadow-sm" width="80" height="80" style="object-fit: cover;">
                <div>
                    <h4 className="fw-bold mb-1"><?php echo htmlspecialchars($admin['name']); ?></h4>
                    <span className="badge bg-primary-subtle text-primary py-2 px-3 small rounded-3">System Administrator</span>
                </div>
            </div>

            <form action="profile.php" method="POST" className="space-y-4">
                <div className="row g-3">
                    <div className="col-12">
                        <label className="form-label small fw-bold">Full Profile Name</label>
                        <input type="text" name="name" required className="form-control" value="<?php echo htmlspecialchars($admin['name']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Email Address</label>
                        <input type="email" name="email" required className="form-control" value="<?php echo htmlspecialchars($admin['email']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label small fw-bold">Librarian Role</label>
                        <input type="text" disabled className="form-control bg-light" value="Academic/Admin Coordinator">
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Profile Photo URL</label>
                        <input type="text" name="photo_url" className="form-control font-mono text-xs" value="<?php echo htmlspecialchars($admin['photo_url']); ?>">
                    </div>
                </div>

                <div className="mt-4 pt-3">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 shadow-sm text-xs" style="background-color: var(--brand-blue); border-radius: 10px;">
                        <i className="bi bi-person-check me-1"></i> Save Profile Details
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
