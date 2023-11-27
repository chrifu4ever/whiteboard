<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $canvasData = $data['canvas'];
    $objectsData = $data['objects'];

    // Pfade definieren
    $savePath = '../files/';
    $zipPath = $savePath . 'alternative.zip';

    // Stelle sicher, dass der Speicherpfad existiert
    if (!file_exists($savePath)) {
        mkdir($savePath, 0777, true);
    }

    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
        // Canvas-Bild speichern
        $canvasImagePath = $savePath . 'canvas.png';
        $canvasData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $canvasData));
        file_put_contents($canvasImagePath, $canvasData);
        $zip->addFile($canvasImagePath, 'canvas.png');

        // Verarbeite die Objekte
        foreach ($objectsData as $index => $object) {
            // Logik zum Speichern und Hinzufügen der Objekte zum ZIP
            // ...
        }

        // Schließe das ZIP-Archiv
        $zip->close();
        echo json_encode(['status' => 'success', 'message' => 'ZIP file created.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Cannot create ZIP file.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
