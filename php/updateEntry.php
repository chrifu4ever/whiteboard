<?php
require 'connectDB.php';

// JSON-Daten aus dem Request lesen
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['id']) && isset($data['data'])) {
    // Verbindung zur Datenbank herstellen
    $db = new ConnectDB();
    $mysqli = $db->connect();

    // Daten aus dem Request extrahieren
    $persID = $data['id'];
    $updatedData = $data['data'];

    // SQL-Query vorbereiten
    $query = "UPDATE Personal SET 
        Vorname = ?, 
        Nachname = ?, 
        Abteilung = ?, 
        Geburtsdatum = ?, 
        Eintrittsdatum = ?, 
        Austrittsdatum = ?
        WHERE PersID = ?";

    if ($stmt = $mysqli->prepare($query)) {
        // Parameter binden
        $stmt->bind_param(
            "ssssssi",
            $updatedData['Vorname'],
            $updatedData['Nachname'],
            $updatedData['Abteilung'],
            $updatedData['Geburtsdatum'],
            $updatedData['Eintrittsdatum'],
            $updatedData['Austrittsdatum'],
            $persID
        );

        // SQL-Statement ausführen
        if ($stmt->execute()) {
            echo "Update erfolgreich.";
        } else {
            error_log("Fehler beim Update: " . $stmt->error);
            echo "Fehler beim Update.";
        }

        // Statement schließen
        $stmt->close();
    } else {
        error_log("Fehler beim Vorbereiten des Statements: " . $mysqli->error);
        echo "Fehler beim Vorbereiten des Updates.";
    }
} else {
    echo "Ungültige Anfrage.";
}

?>
