<?php
// Überprüfen, ob exec() verfügbar ist
if (in_array('exec', array_map('trim', explode(',', ini_get('disable_functions'))))) {
    die("Fehler: exec() ist auf diesem Server deaktiviert.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $target_dir = "drop/";
    $uploadOk = 1;
    $pdfFile = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $imageFileType = strtolower(pathinfo($pdfFile, PATHINFO_EXTENSION));

    // Überprüfen, ob die Datei tatsächlich eine PDF-Datei ist
    if ($imageFileType != "pdf") {
        echo "Nur PDF-Dateien sind erlaubt.";
        $uploadOk = 0;
    }

    // Wenn alles in Ordnung ist, versuche die Datei hochzuladen
    if ($uploadOk == 1) {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $pdfFile)) {
            echo "Die Datei ". htmlspecialchars(basename($_FILES["fileToUpload"]["name"])) . " wurde hochgeladen.";

            // Konvertierung zu SVG
            $outputFile = $target_dir . pathinfo($pdfFile, PATHINFO_FILENAME) . ".svg";
            $command = "/usr/bin/pdf2svg -v " . escapeshellarg($pdfFile) . " " . escapeshellarg($outputFile) . " 1";

            exec($command, $output, $return_var);

            // Ausgabe der Serverantwort und des Rückgabewerts
            echo "Rückgabewert: $return_var\n";
            echo "Ausgabe:\n";
            foreach ($output as $line) {
                echo $line . "\n";
            }

            if ($return_var == 0) {
                echo "Die Konvertierung in SVG war erfolgreich.";
            } else {
                echo "Ein Fehler ist bei der Konvertierung aufgetreten.";
            }

        } else {
            echo "Ein Fehler ist beim Hochladen Ihrer Datei aufgetreten.";
        }
    }
}
?>
