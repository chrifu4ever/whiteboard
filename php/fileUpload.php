<?php
include 'convertPdfToSvg.php'; // Pfad zur convertPdfToSvg.php

// Zielpfad definieren
$normalDir = "../files/";
$tempDir = "../files/temp/";

// Stelle sicher, dass die Datei hochgeladen wurde
if (isset($_FILES['file']['name'])) {
    $filename = basename($_FILES['file']['name']);
    $fileType = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $targetFilePath = ($fileType === 'pdf') ? $tempDir . $filename : $normalDir . $filename;

    // Versuche, die Datei zu speichern
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
        if ($fileType === 'pdf') {
            // Konvertiere PDF in SVG
            $svgFiles = convertPdfToSvg($targetFilePath, $normalDir);

            // Lösche die Original-PDF im temp-Ordner
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
