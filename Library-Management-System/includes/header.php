<?php
/**
 * @license Apache-2.0
 * Reusable Header file
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management System - Minor College Project</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand-blue: #2563eb;
            --brand-blue-dark: #1e40af;
            --brand-light: #f8fafc;
            --brand-gray: #e2e8f0;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--brand-light);
            color: #0f172a;
        }
        .navbar-brand {
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .bg-brand-blue {
            background-color: var(--brand-blue) !important;
        }
        .card-stats {
            transition: transform 0.2s, box-shadow 0.2s;
            border-radius: 16px !important;
        }
        .card-stats:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
        }
        .table-responsive {
            border-radius: 12px;
        }
        .form-control, .form-select {
            border-radius: 10px;
            padding: 0.6rem 0.9rem;
            border: 1px solid #cbd5e1;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--brand-blue);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .btn-brand {
            background-color: var(--brand-blue);
            color: white;
            border-radius: 10px;
            padding: 0.6rem 1.2rem;
            font-weight: 500;
        }
        .btn-brand:hover {
            background-color: var(--brand-blue-dark);
            color: white;
        }
        @media print {
            .no-print {
                display: none !important;
            }
            .print-only {
                display: block !important;
            }
            .card {
                border: 1px solid #cbd5e1 !important;
                box-shadow: none !important;
            }
        }
    </style>
</head>
<body>
