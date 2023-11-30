<?php
$sourceDir = '../files/';
$destinationDir = '../files/saved/';

// Lösche alle Dateien im Zielverzeichnis
if (is_dir($destinationDir)) {
    $files = glob($destinationDir . '*', GLOB_MARK); // Hol alle Dateien im Verzeichnis
    foreach ($files as $file) {
       
            unlink($file); // Lösche Datei
        
    }
} else {
    mkdir($destinationDir, 0755, true); // Erstelle das Verzeichnis, falls es nicht existiert
}

// Kopiere alle Dateien aus dem Quellverzeichnis
foreach (glob($sourceDir . '*') as $file) {
    $destFile = $destinationDir . basename($file);
    if (!copy($file, $destFile)) {
        echo json_encode(['message' => 'Fehler beim Kopieren der Datei: ' . basename($file)]);
        exit;
    }
}

echo json_encode(['message' => 'Alle Dateien erfolgreich kopiert.']);
?>
