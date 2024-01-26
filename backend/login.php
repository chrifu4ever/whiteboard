<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
include '../php/connectDB.php';

$message = ''; // Variable für Nachrichten

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $password = $_POST['password'];

    $db = new ConnectDB();
    $conn = $db->connect();

    $hashedPassword = hash('sha256', $password); // Hash das eingegebene Passwort
    $query = "SELECT Passwort FROM Login WHERE Page = 'backend'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($hashedPassword == $row['Passwort']) {
            $_SESSION['loggedin'] = true;
            header('Location: index.php');
            exit;
        } else {
            $message = "Falsches Passwort!";
        }
    } else {
        $message = "Kein Eintrag für 'backend' gefunden. Bitte IT kontaktieren";
    }
    $conn->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link rel="stylesheet" href="../css/login.css">
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="login-container">
        <img src="../frontend/img/Sidler_Logo.png" class="logo" alt="Sidler Logo">
        <form method="post">
            <p>Whiteboard-Backend Login</p>
            Passwort: <input type="password" name="password">
            <button type="submit">Einloggen</button>
        </form>
    </div>

    <script>
    window.onload = function() {
        var message = "<?php echo $message; ?>";
        if (message != "") {
            Swal.fire({
                title: 'Hinweis!',
                text: message,
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        }
    }
    </script>
</body>
</html>
