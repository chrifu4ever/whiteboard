<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $objectsData = $data['objects'];

    // Pfad zur JSON-Datei
    $jsonFilePath = '../files/canvas.json';

    // Lese die vorhandene JSON-Datei
    $jsonData = file_exists($jsonFilePath) ? json_decode(file_get_contents($jsonFilePath), true) : [];

    // Füge die neuen Objektinformationen hinzu
    foreach ($objectsData as $object) {
        $jsonData[] = $object;
    }

    // Schreibe die aktualisierten Daten zurück in die JSON-Datei
    file_put_contents($jsonFilePath, json_encode($jsonData));

    echo json_encode(['status' => 'success', 'message' => 'Canvas data saved successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
