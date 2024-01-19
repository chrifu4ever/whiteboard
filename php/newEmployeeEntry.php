<?php
require_once 'connectDB.php';

function getDepartments($mysqli) {
    $query = "SELECT Abteilungsname FROM Abteilungen";
    $result = $mysqli->query($query);

    $departments = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $departments[] = $row['Abteilungsname'];
        }
    }
    return $departments;
}

$db = new ConnectDB();
$mysqli = $db->connect();

//  Daten aus dem Formular lesen
    $vorname = $_POST['vorname'] ?? null;
    $nachname = $_POST['nachname'] ?? null;
    $geburtsdatum = $_POST['geburtsdatum'] ?? null;
    $eintrittsdatum = $_POST['eintrittsdatum'] ?? null;
    $abteilung = $_POST['abteilung'] ?? null;
    $foto = $_POST['bild'] ?? null;

    $query = "INSERT INTO Personal (Vorname, Nachname, Geburtsdatum, Eintrittsdatum, Autrittsdatum, Abteilung, Foto) VALUES (?, ?, ?, ?, ?,, NULL, ?)";
    
    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("ssssss", $vorname, $nachname, $geburtsdatum, $eintrittsdatum, $abteilung, $foto);

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
