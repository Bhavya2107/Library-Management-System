<?php
/**
 * @license Apache-2.0
 * Reusable Navbar file
 */
$base = isset($base_path) ? $base_path : '';
?>
<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 no-print">
    <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 text-white" href="<?php echo $base; ?>dashboard.php">
            <i className="bi bi-book-half text-primary fs-3"></i>
            <span className="fw-bold">LMS Portal</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <a className="nav-link px-3" href="<?php echo $base; ?>dashboard.php">
                        <i className="bi bi-speedometer2 me-1"></i> Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link px-3" href="<?php echo $base; ?>books/index.php">
                        <i className="bi bi-book me-1"></i> Books
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link px-3" href="<?php echo $base; ?>students/index.php">
                        <i className="bi bi-people me-1"></i> Students
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link px-3" href="<?php echo $base; ?>categories/index.php">
                        <i className="bi bi-tags me-1"></i> Categories
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link px-3" href="<?php echo $base; ?>issue/index.php">
                        <i className="bi bi-arrow-left-right me-1"></i> Issue / Return
                    </a>
                </li>
            </ul>
            <div className="d-flex align-items-center gap-3">
                <div className="dropdown">
                    <a className="d-flex align-items-center gap-2 text-decoration-none dropdown-toggle text-white-50" href="#" role="button" data-bs-toggle="dropdown">
                        <img src="<?php echo isset($_SESSION['admin_photo']) && $_SESSION['admin_photo'] ? $_SESSION['admin_photo'] : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'; ?>" className="rounded-circle border border-secondary" width="35" height="35" style="object-fit: cover;">
                        <span className="small text-white"><?php echo htmlspecialchars($_SESSION['admin_name'] ?? 'Admin'); ?></span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                        <li><a className="dropdown-item py-2" href="<?php echo $base; ?>profile.php"><i className="bi bi-person me-2 text-muted"></i> My Profile</a></li>
                        <li><a className="dropdown-item py-2" href="<?php echo $base; ?>change_password.php"><i className="bi bi-key me-2 text-muted"></i> Change Password</a></li>
                        <li><hr className="dropdown-divider"></li>
                        <li><a className="dropdown-item py-2 text-rose-600" href="<?php echo $base; ?>logout.php"><i className="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</nav>
