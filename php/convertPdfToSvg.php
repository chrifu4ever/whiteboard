<?php
function convertPdfToSvg($pdfFilePath, $outputDir) {
    $svgFiles = [];
    for ($i = 0; $i < 10; $i++) {
        $svgFile = $outputDir . pathinfo($pdfFilePath, PATHINFO_FILENAME) . "_$i.svg";
        // Beachten Sie die Änderung hier: ($i + 1) wird außerhalb des Strings berechnet
        $command = "pdf2svg '{$pdfFilePath}' '{$svgFile}' " . ($i + 1);
        shell_exec($command, $output, $return_var);

        if ($return_var === 0) {
            $svgFiles[] = $svgFile;
        } else {
            break; // Beende die Schleife bei einem Fehler
        }
    }
    return $svgFiles;
}
?>
