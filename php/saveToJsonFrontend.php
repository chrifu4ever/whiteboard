<?php
$filePath = '../files/saved/files.json'; // Pfad zur JSON-Datei
$updatedFilePath = '../files/saved/'; // Pfad, der dem 'filepath' hinzugefügt wird

// Lies die JSON-Datei
$jsonData = file_get_contents($filePath);

// Stelle sicher, dass die Datei erfolgreich gelesen wurde
if ($jsonData === false) {
    echo json_encode(['error' => 'Fehler beim Lesen der JSON-Datei']);
    exit;
}

// Dekodiere die JSON-Daten in ein PHP-Array
$data = json_decode($jsonData, true);

// Stelle sicher, dass die Dekodierung erfolgreich war
if ($data === null) {
    echo json_encode(['error' => 'Fehler beim Verarbeiten der JSON-Daten']);
    exit;
}

// Durchlaufe alle Elemente und ändere den 'filepath'
foreach ($data as &$item) {
    if (isset($item['filepath'])) {
        $item['filepath'] = str_replace('../files/', '../files/saved/', $item['filepath']);
    }
}

// Kodiere das aktualisierte PHP-Array zurück in JSON
$updatedJsonData = json_encode($data, JSON_PRETTY_PRINT);

// Stelle sicher, dass die Kodierung erfolgreich war
if ($updatedJsonData === false) {
    echo json_encode(['error' => 'Fehler beim Kodieren der JSON-Daten']);
    exit;
}

// Schreibe die aktualisierten JSON-Daten zurück in die Datei
$result = file_put_contents($filePath, $updatedJsonData);

// Überprüfe, ob das Schreiben erfolgreich war
if ($result === false) {
    echo json_encode(['error' => 'Fehler beim Schreiben in die JSON-Datei']);
} else {
    echo json_encode(['message' => 'Erfolgreich den "filepath" für alle Elemente aktualisiert']);
}
?>
