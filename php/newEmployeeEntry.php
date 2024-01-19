<?php
require_once 'connectDB.php';

$db = new ConnectDB();
$mysqli = $db->connect();

// Daten aus dem Formular lesen
$vorname = $_POST['vorname'] ?? null;
$nachname = $_POST['nachname'] ?? null;
$geburtsdatum = $_POST['geburtsdatum'] ?? null;
$eintrittsdatum = $_POST['eintrittsdatum'] ?? null;
$foto = $_POST['bild'] ?? null; // Stelle sicher, dass du den Dateinamen des Bildes hier angibst

// SQL-Statement zum Einfügen der Daten
$query = "INSERT INTO Personal (Vorname, Nachname, Geburtsdatum, Eintrittsdatum, Austrittsdatum, Foto) VALUES (?, ?, ?, ?, NULL, ?)";

if ($stmt = $mysqli->prepare($query)) {
    $stmt->bind_param("sssss", $vorname, $nachname, $geburtsdatum, $eintrittsdatum, $foto);

    if ($stmt->execute()) {
        echo "Mitarbeiter erfolgreich angelegt.";
    } else {
        echo "Fehler beim Anlegen des Mitarbeiters: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Fehler beim Vorbereiten des Statements: " . $mysqli->error;
}

$mysqli->close();
?>
