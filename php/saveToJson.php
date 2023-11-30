<?php
$jsonFile = '../files.json';  // Pfad zur JSON-Datei, anpassen nach Bedarf

// Empfange die JSON-Daten vom JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Lies die aktuelle JSON-Datei
if (file_exists($jsonFile)) {
    $jsonArray = json_decode(file_get_contents($jsonFile), true);
} else {
    $jsonArray = [];
}

// Füge die neuen Daten hinzu
array_push($jsonArray, $data);

// Schreibe die aktualisierten Daten zurück in die JSON-Datei
file_put_contents($jsonFile, json_encode($jsonArray, JSON_PRETTY_PRINT));

echo json_encode(['message' => 'Daten erfolgreich gespeichert']);
?>