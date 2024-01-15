<?php
require 'connectDB.php';

if (isset($_POST['id']) && isset($_POST['data'])) {
    $persID = $_POST['id'];
    $updatedData = $_POST['data'];
    $db = new ConnectDB();

    // SQL-Update-Query
    $query = "UPDATE Personal SET 
              Vorname = ?, 
              Nachname = ?, 
              Abteilung = ?, 
              Geburtsdatum = ?, 
              WHERE PersID = ?";

    $stmt = $db->connect()->prepare($query);
    $stmt->bind_param("ssssssi", 
        $updatedData['Vorname'], 
        $updatedData['Nachname'], 
        $updatedData['Abteilung'], 
        $updatedData['Geburtsdatum'], 
        $persID
    );

    if ($stmt->execute()) {
        echo "Update erfolgreich.";
    } else {
        echo "Fehler beim Update: " . $stmt->error;
    }
    $stmt->close();
}
?>
