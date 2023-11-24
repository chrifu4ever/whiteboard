<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $canvasData = $data['canvas']; // Base64 codiertes Canvas-Bild
    $objectsData = json_decode($data['objects'], true); // Array von Objektdaten

    // Pfade definieren
    $savePath = '../files/';
    $zipPath = $savePath . 'alternative.zip';

    // Erstelle und öffne ein neues ZIP-Archiv
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
        // Canvas-Bild speichern
        $canvasImagePath = $savePath . 'canvas.png';
        $canvasData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $canvasData));
        file_put_contents($canvasImagePath, $canvasData);
        $zip->addFile($canvasImagePath, 'canvas.png');

        // Durchlaufe die Objekte und füge sie zum ZIP hinzu
        foreach ($objectsData as $index => $object) {
            if ($object['type'] === 'image' || $object['type'] === 'pdf') {
                // Für dieses Beispiel wird angenommen, dass die Objekte Dateipfade enthalten
                // In der Praxis müsstest du die tatsächlichen Dateien aus den Daten extrahieren
                $filePath = $savePath . basename($object['content']);
                $zip->addFile($filePath, basename($object['content']));
            }
        }

        // Schließe das ZIP-Archiv
        $zip->close();

        // Rückgabe einer Erfolgsmeldung
        echo json_encode(['status' => 'success']);
    } else {
        // Rückgabe einer Fehlermeldung
        echo json_encode(['status' => 'error', 'message' => 'Cannot create ZIP file.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
