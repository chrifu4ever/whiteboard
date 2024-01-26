<?php
require_once 'connectDB.php';

$db = new ConnectDB();
$mysqli = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vorname = $_POST['vorname'] ?? null;
    $nachname = $_POST['nachname'] ?? null;
    $geburtsdatum = $_POST['geburtsdatum'] ?? null;
    $eintrittsdatum = $_POST['eintrittsdatum'] ?? null;
    $abteilung = $_POST['abteilung'] ?? null;

    // Bildverarbeitung
    $imagePath = '../personal/personalbilder/';
    $imageFileName = '';
    if (isset($_FILES['bild']) && $_FILES['bild']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['bild'];
        $imageFileName = $nachname. '_' .$vorname. '-' .basename($file['name']); // Eindeutiger Dateiname
        $target = $imagePath . $imageFileName;

        // Verschieben des Bildes in den Zielordner
        if (!move_uploaded_file($file['tmp_name'], $target)) {
            echo "Fehler beim Speichern des Bildes.";
            exit;
        }
    }

    // SQL-Statement zum Einfügen der Daten
    $query = "INSERT INTO Personal (Vorname, Nachname, Geburtsdatum, Eintrittsdatum, Abteilung, Foto) VALUES (?, ?, ?, ?, ?, ?)";
    
    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("ssssss", $vorname, $nachname, $geburtsdatum, $eintrittsdatum, $abteilung, $imageFileName);

        if ($stmt->execute()) {
            echo "Mitarbeiter erfolgreich angelegt.";
        } else {
            echo "Fehler beim Anlegen des Mitarbeiters: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Fehler beim Vorbereiten des Statements: " . $mysqli->error;
    }
}

$mysqli->close();

?>
