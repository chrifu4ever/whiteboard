<?php
$jsonFile = '../files/files.json';

// Empfange die JSON-Daten vom JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Stelle sicher, dass die Daten korrekt empfangen wurden
if ($data === null) {
    echo json_encode(['error' => 'Ungültige oder keine Daten empfangen']);
    exit;
}

// Lies die aktuelle JSON-Datei
if (file_exists($jsonFile)) {
    $jsonArray = json_decode(file_get_contents($jsonFile), true);
    if ($jsonArray === null) {
        echo json_encode(['error' => 'Fehler beim Lesen der JSON-Datei']);
        exit;
    }
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

// Versuche, die aktualisierten Daten in die JSON-Datei zu schreiben
$result = file_put_contents($jsonFile, json_encode($jsonArray, JSON_PRETTY_PRINT));

// Überprüfe, ob der Schreibvorgang erfolgreich war
if ($result === false) {
    echo json_encode(['error' => 'Fehler beim Schreiben in die JSON-Datei']);
} else {
    echo json_encode(['message' => 'Daten erfolgreich gespeichert']);
}
?>
