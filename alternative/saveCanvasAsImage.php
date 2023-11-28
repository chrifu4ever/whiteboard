<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $imageData = $data['image'];

    // Entferne den Base64-URL-Präfix und dekodiere die Daten
    $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

    // Pfad, in dem das Bild gespeichert werden soll
    $uploadDir = '../files/';
    $uploadFilePath = $uploadDir . 'canvas.jpg';

    // Stelle sicher, dass das Verzeichnis existiert
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Schreibe die Bilddaten in eine Datei
    if (file_put_contents($uploadFilePath, $imageData)) {
        echo json_encode(['status' => 'success', 'message' => 'Canvas saved as image.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save canvas as image.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
