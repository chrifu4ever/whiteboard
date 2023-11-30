<?php
// Zielpfad definieren
$targetDir = "../files/";

// Stelle sicher, dass die Datei hochgeladen wurde
if (isset($_FILES['file']['name'])) {
    $filename = basename($_FILES['file']['name']);
    $targetFilePath = $targetDir . $filename;

    // Versuche, die Datei zu speichern
    if(move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)){
        // Gib den Pfad zurück, wenn der Upload erfolgreich war
        echo json_encode(['filePath' => $targetFilePath]);
    } else {
        echo json_encode(['error' => 'Datei konnte nicht hochgeladen werden.']);
    }
} else {
    echo json_encode(['error' => 'Keine Datei empfangen.']);
}
?>
