<?php
require_once 'connectDB.php';

if (isset($_POST['id'])) {
    $persId = $_POST['id'];

    $db = new ConnectDB();
    $mysqli = $db->connect();

    $query = "DELETE FROM Personal WHERE PersID = ?";

    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param("i", $persId);

        if ($stmt->execute()) {
            echo "Eintrag erfolgreich gelöscht.";
        } else {
            echo "Fehler beim Löschen des Eintrags: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Fehler beim Vorbereiten des Statements: " . $mysqli->error;
    }

    $mysqli->close();
} else {
    echo "Keine ID zum Löschen angegeben.";
}
?>
