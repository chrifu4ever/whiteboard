<?php

// Pfad zu den Quell- und Zielverzeichnissen
$sourceDir = '../files/';
$targetDir = '../files/saved/';

// Erstelle das Zielverzeichnis, falls es nicht existiert
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Kopiere alle Dateien aus dem Quellverzeichnis in das Zielverzeichnis
foreach (glob($sourceDir . '*') as $file) {
    $destFile = str_replace($sourceDir, $targetDir, $file);
    if (copy($file, $destFile)) {
        echo "Datei $file erfolgreich nach $destFile kopiert.\n";
    } else {
        echo "Fehler beim Kopieren der Datei $file.\n";
    }
}

// Aktualisiere die files.json
$jsonFile = $sourceDir . 'files.json';
if (file_exists($jsonFile)) {
    $jsonData = json_decode(file_get_contents($jsonFile), true);

    foreach ($jsonData as &$item) {
        $item['filepath'] = str_replace('../files/', '../files/saved/', $item['filepath']);
    }

    // Speichere die aktualisierte JSON zurück in das Dateisystem
    if (file_put_contents($targetDir . 'files.json', json_encode($jsonData, JSON_PRETTY_PRINT))) {
        echo "files.json wurde erfolgreich aktualisiert.\n";
    } else {
        echo "Fehler beim Aktualisieren der files.json.\n";
    }
} else {
    echo "files.json wurde nicht gefunden.\n";
}

?>
