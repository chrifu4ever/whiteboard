<?php
$filesDir = '../files/';

// Lösche alle Dateien im Verzeichnis
if (is_dir($filesDir)) {
    $files = glob($filesDir . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {
            // Optional: Unterverzeichnisse löschen, falls benötigt
        } else {
            unlink($file);
        }
    }
    echo json_encode(['message' => 'Alle Dateien im Ordner wurden gelöscht.']);
} else {
    echo json_encode(['error' => 'Verzeichnis existiert nicht.']);
}
?>
