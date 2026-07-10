<?php
/**
 * @license Apache-2.0
 * Secure Session Logout
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Clear all session variables
$_SESSION = [];

// Destroy active cookies if any
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy session context
session_destroy();

// Redirect back to root login page
header("Location: index.php");
exit();
?>
