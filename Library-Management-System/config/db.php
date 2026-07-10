<?php
/**
 * @license Apache-2.0
 * Database Connection configuration for Library Management System
 */

$host = 'localhost';
$dbname = 'library_db';
$username = 'root';
$password = ''; // Default password is empty in XAMPP / MAMP (except MAMP macOS which might be 'root')

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection failed. Please check your XAMPP MySQL state! Error: " . $e->getMessage());
}
?>
