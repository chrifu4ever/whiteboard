<?php
require_once 'connectDB.php';

if (isset($_POST['id'])) {
    $persID = $_POST['id'];
    $db = new ConnectDB();
    $mysqli = $db->connect();

    // Zuerst den Dateinamen des Bildes abrufen
    $query = "SELECT Foto FROM Personal WHERE PersID = ?";
    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("i", $persID);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        // Überprüfen, ob ein Bild existiert
        if ($row && $row['Foto']) {
            $filePath = '../personal/personalbilder/' . $row['Foto'];
            // Überprüfen, ob die Datei existiert und löschen
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        $stmt->close();
    }

    // Löschen des Mitarbeiters aus der Datenbank
    $query = "DELETE FROM Personal WHERE PersID = ?";
    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("i", $persID);
        if ($stmt->execute()) {
            echo "Mitarbeiter erfolgreich gelöscht.";
        } else {
            echo "Fehler beim Löschen des Mitarbeiters.";
        }
        $stmt->close();
    } else {
        echo "Fehler beim Vorbereiten des Statements.";
    }

    $mysqli->close();
}
?>
