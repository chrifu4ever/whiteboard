<?php
$jsonFile = '../files/files.json';

// Empfange den Index des zu entfernenden Objekts
$data = json_decode(file_get_contents('php://input'), true);
$index = $data['index'];

// Lies die aktuelle JSON-Datei
if (file_exists($jsonFile)) {
    $jsonArray = json_decode(file_get_contents($jsonFile), true);

    // Überprüfe, ob der Index gültig ist und entferne das Objekt
    if (array_key_exists($index, $jsonArray)) {
        $filepath = $jsonArray[$index]['filepath'];
        array_splice($jsonArray, $index, 1);
        file_put_contents($jsonFile, json_encode($jsonArray, JSON_PRETTY_PRINT));

        // Überprüfe, ob der Pfad noch in anderen Einträgen existiert
        $pathExists = false;
        foreach ($jsonArray as $item) {
            if ($item['filepath'] === $filepath) {
                $pathExists = true;
                break;
            }
        }

        // Wenn der Pfad nicht mehr existiert, lösche die Datei
        if (!$pathExists) {
            if (file_exists($filepath)) {
                unlink($filepath);
            }
        }

        echo json_encode(['message' => 'Objekt und ggf. Datei erfolgreich entfernt']);
    } else {
        echo json_encode(['error' => 'Ungültiger Index']);
    }
} else {
    echo json_encode(['error' => 'JSON-Datei nicht gefunden']);
}
?>
