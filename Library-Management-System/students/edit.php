<?php
/**
 * @license Apache-2.0
 * Edit Student Profile Form
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

$student_id = $_GET['id'];

// Fetch Student record
$stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
$stmt->execute([$student_id]);
$student = $stmt->fetch();

if (!$student) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $enrollment_no = trim($_POST['enrollment_no']);
    $course = trim($_POST['course']);
    $semester = trim($_POST['semester']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $address = trim($_POST['address']);

    if (!empty($name) && !empty($enrollment_no) && !empty($email)) {
        // Prepare statement to edit records, preventing SQL Injection
        $upd_stmt = $conn->prepare("
            UPDATE students 
            SET name = ?, enrollment_no = ?, course = ?, semester = ?, email = ?, phone = ?, address = ?
            WHERE id = ?
        ");

        try {
            $upd_stmt->execute([$name, $enrollment_no, $course, $semester, $email, $phone, $address, $student_id]);
            $success_message = "Student record updated successfully!";
            
            // Re-fetch updated info
            $stmt->execute([$student_id]);
            $student = $stmt->fetch();
        } catch (PDOException $e) {
            $error_message = "Failed to update profile. Enrollment number or Email address might already exist.";
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
            <h3 className="fw-black text-slate-900 mb-0">Edit Student Profile</h3>
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

            <form action="edit.php?id=<?php echo urlencode($student_id); ?>" method="POST" className="space-y-4 text-xs">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Student ID</label>
                        <input type="text" disabled className="form-control font-mono bg-light" value="<?php echo htmlspecialchars($student['id']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Enrollment Number</label>
                        <input type="text" name="enrollment_no" required className="form-control font-mono" placeholder="Enrollment #" value="<?php echo htmlspecialchars($student['enrollment_no']); ?>">
                    </div>

                    <div className="col-12">
                        <label className="form-label font-bold text-slate-700">Full Name</label>
                        <input type="text" name="name" required className="form-control" placeholder="Student name" value="<?php echo htmlspecialchars($student['name']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Course / Department</label>
                        <select name="course" required className="form-select">
                            <option value="BCA" <?php echo $student['course'] === 'BCA' ? 'selected' : ''; ?>>BCA</option>
                            <option value="MCA" <?php echo $student['course'] === 'MCA' ? 'selected' : ''; ?>>MCA</option>
                            <option value="B.Tech CSE" <?php echo $student['course'] === 'B.Tech CSE' ? 'selected' : ''; ?>>B.Tech CSE</option>
                            <option value="Diploma CS" <?php echo $student['course'] === 'Diploma CS' ? 'selected' : ''; ?>>Diploma CS</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Current Semester</label>
                        <select name="semester" required className="form-select">
                            <option value="I" <?php echo $student['semester'] === 'I' ? 'selected' : ''; ?>>Semester I</option>
                            <option value="II" <?php echo $student['semester'] === 'II' ? 'selected' : ''; ?>>Semester II</option>
                            <option value="III" <?php echo $student['semester'] === 'III' ? 'selected' : ''; ?>>Semester III</option>
                            <option value="IV" <?php echo $student['semester'] === 'IV' ? 'selected' : ''; ?>>Semester IV</option>
                            <option value="V" <?php echo $student['semester'] === 'V' ? 'selected' : ''; ?>>Semester V</option>
                            <option value="VI" <?php echo $student['semester'] === 'VI' ? 'selected' : ''; ?>>Semester VI</option>
                            <option value="VII" <?php echo $student['semester'] === 'VII' ? 'selected' : ''; ?>>Semester VII</option>
                            <option value="VIII" <?php echo $student['semester'] === 'VIII' ? 'selected' : ''; ?>>Semester VIII</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Email Address</label>
                        <input type="email" name="email" required className="form-control" placeholder="Email" value="<?php echo htmlspecialchars($student['email']); ?>">
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label font-bold text-slate-700">Contact Phone Number</label>
                        <input type="tel" name="phone" required className="form-control" placeholder="Phone" value="<?php echo htmlspecialchars($student['phone']); ?>">
                    </div>

                    <div className="col-12">
                        <label className="form-label font-bold text-slate-700">Residential Address</label>
                        <textarea name="address" rows="3" className="form-control" placeholder="Complete address..."><?php echo htmlspecialchars($student['address']); ?></textarea>
                    </div>
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                    <button type="submit" className="btn btn-primary px-4 py-2.5 fw-semibold border-0 text-xs" style="background-color: var(--brand-blue); border-radius:10px;">
                        Update Student Info
                    </button>
                    <a href="index.php" className="btn btn-light px-4 py-2.5 border text-xs" style="border-radius:10px;">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once $root_dir . 'includes/footer.php'; ?>
