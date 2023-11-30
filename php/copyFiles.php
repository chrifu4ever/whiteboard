<?php
$sourceDir = '../files/';
$destinationDir = '../files/saved/';

// Erstelle das Zielverzeichnis, falls es nicht existiert
if (!file_exists($destinationDir)) {
    mkdir($destinationDir, 0755, true);
}

// Kopiere alle Dateien
foreach (glob($sourceDir . '*') as $file) {
    $destFile = $destinationDir . basename($file);
    if (!copy($file, $destFile)) {
        echo json_encode(['message' => 'Fehler beim Kopieren der Datei: ' . basename($file)]);
        exit;
    }
}

echo json_encode(['message' => 'Alle Dateien erfolgreich kopiert.']);
?>
