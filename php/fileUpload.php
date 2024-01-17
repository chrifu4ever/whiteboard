<?php
include 'convertPdfToSvg.php'; // Pfad zur convertPdfToSvg.php

// Zielpfad definieren
$normalDir = "../files/";

// Stelle sicher, dass die Datei hochgeladen wurde
if (isset($_FILES['file']['name'])) {
    $originalFilename = basename($_FILES['file']['name']);
    $fileType = $_FILES['file']['type'];

    // Bereinige den Dateinamen
    $filename = preg_replace("/[^a-zA-Z0-9\.\-\_]/", "", $originalFilename);

    // Bestimme den Ziel-Dateipfad
    $targetFilePath = $normalDir . $filename;

    // Versuche, die Datei zu speichern
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
        if ($fileType === 'application/pdf') {
            // Konvertiere PDF in SVG
            $svgFiles = convertPdfToSvg($targetFilePath, $normalDir);

            // Lösche die Original-PDF-Datei
            unlink($targetFilePath);

            // Rückgabe der SVG-Dateipfade
            echo json_encode(['svgFiles' => $svgFiles]);
        } else {
            // Gib den Pfad zurück, wenn der Upload von Bildern erfolgreich war
            echo json_encode(['filePath' => $targetFilePath]);
        }
    } else {
        echo json_encode(['error' => 'Datei konnte nicht hochgeladen werden.']);
    }
} else {
    echo json_encode(['error' => 'Keine Datei empfangen.']);
}
?>
