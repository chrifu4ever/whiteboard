<?php
$jsonFile = '../files/files.json';

// Empfange die JSON-Daten vom JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Lies die aktuelle JSON-Datei
if (file_exists($jsonFile)) {
    $jsonArray = json_decode(file_get_contents($jsonFile), true);
} else {
    $jsonArray = [];
}

// Aktualisiere das spezifizierte Objekt oder füge ein neues hinzu
$index = $data['index'];
if(isset($jsonArray[$index])) {
    $jsonArray[$index] = $data;
} else {
    $jsonArray[] = $data;
}

// Schreibe die aktualisierten Daten zurück in die JSON-Datei
file_put_contents($jsonFile, json_encode($jsonArray, JSON_PRETTY_PRINT));

echo json_encode(['message' => 'Daten erfolgreich gespeichert']);
?>
