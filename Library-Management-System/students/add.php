<?php
/**
 * @license Apache-2.0
 * Register Student Profile Form
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = trim($_POST['id']);
    $name = trim($_POST['name']);
    $enrollment_no = trim($_POST['enrollment_no']);
    $course = trim($_POST['course']);
    $semester = trim($_POST['semester']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $address = trim($_POST['address']);

    if (!empty($id) && !empty($name) && !empty($enrollment_no) && !empty($email)) {
        // Validate duplicates
        $check_stmt = $conn->prepare("SELECT COUNT(*) FROM students WHERE id = ? OR enrollment_no = ? OR email = ?");
        $check_stmt->execute([$id, $enrollment_no, $email]);

        if ($check_stmt->fetchColumn() > 0) {
            $error_message = "A student with this Student ID, Enrollment Number, or Email address is already registered.";
        } else {
            $ins_stmt = $conn->prepare("
                INSERT INTO students (id, name, enrollment_no, course, semester, email, phone, address)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");

            try {
                $ins_stmt->execute([$id, $name, $enrollment_no, $course, $semester, $email, $phone, $address]);
                $success_message = "Student profile created successfully!";
            } catch (PDOException $e) {
                $error_message = "Failed to register student. Error: " . $e->getMessage();
            }
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
            <h3 className="fw-black text-slate-900 mb-0">Register Student Profile</h3>
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

            <form action="add.php" method="POST" className="space-y-4 text-xs">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Student ID</label>
                        <input type="text" name="id" required className="form-control font-mono" placeholder="STU101" value="<?php echo htmlspecialchars($_POST['id'] ?? ''); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Enrollment Number</label>
                        <input type="text" name="enrollment_no" required className="form-control font-mono" placeholder="EN202611" value="<?php echo htmlspecialchars($_POST['enrollment_no'] ?? ''); ?>">
                    </div>

                    <div className="col-12">
                        <label className="form-label font-bold text-slate-700">Full Name</label>
                        <input type="text" name="name" required className="form-control" placeholder="Enter student's name" value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Course / Department</label>
                        <select name="course" required className="form-select">
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                            <option value="B.Tech CSE">B.Tech CSE</option>
                            <option value="Diploma CS">Diploma CS</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Current Semester</label>
                        <select name="semester" required className="form-select">
                            <option value="I">Semester I</option>
                            <option value="II">Semester II</option>
                            <option value="III">Semester III</option>
                            <option value="IV">Semester IV</option>
                            <option value="V">Semester V</option>
                            <option value="VI">Semester VI</option>
                            <option value="VII">Semester VII</option>
                            <option value="VIII">Semester VIII</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Email Address</label>
                        <input type="email" name="email" required className="form-control" placeholder="student@college.edu" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Contact Phone Number</label>
                        <input type="tel" name="phone" required className="form-control" placeholder="10-digit phone" value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>">
                    </div>

                    <div className="col-12">
                        <label className="form-label font-bold text-slate-700">Residential Address</label>
                        <textarea name="address" rows="3" className="form-control" placeholder="Complete address..."><?php echo htmlspecialchars($_POST['address'] ?? ''); ?></textarea>
                    </div>
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 text-xs" style="background-color: var(--brand-blue); border-radius:10px;">
                        Register Student Info
                    </button>
                    <a href="index.php" className="btn btn-light px-4 py-2.5 border text-xs" style="border-radius:10px;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
