<?php
function convertPdfToSvg($pdfFilePath, $outputDir) {
    $svgFiles = [];
    for ($i = 0; $i < 10; $i++) {
        $svgFile = $outputDir . pathinfo($pdfFilePath, PATHINFO_FILENAME) . "_$i.svg";
        $command = "pdf2svg '{$pdfFilePath}' '{$svgFile}' " . ($i + 1);
        exec($command, $output, $return_var);

        // Überprüfen, ob die SVG-Datei erstellt wurde und existiert
        if ($return_var === 0 && file_exists($svgFile)) {
            $svgFiles[] = $svgFile;
        } else {
            // Beende die Schleife bei einem Fehler oder wenn die Datei nicht existiert
            break;
        }
    }
    return $svgFiles;
} return $svgFiles;

?>
