<!DOCTYPE html>
<html>

<head>
    <title>Sidler Whiteboard Backend</title>
    <link rel="stylesheet" href="../css/backend.css">
    <link rel="shortcut icon" href="../frontend/img/favicon.ico" type="image/x-icon" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>

    <div id="menu-container">
        <img src="../frontend/img/Sidler_Logo.png" id="sidler_logo">
        <input type="file" id="fileInputButton" accept="image/*,application/pdf">
        <button id="clearCanvasButton">Alle Bilder entfernen</button>
        <!--  <button id="saveButton">Canvas Speichern</button> -->
        <button id="goLiveWhiteboardButton">Whiteboard veröffentlichen</button>

    </div>
    <div id="canvas-container">
    <canvas id="main-canvas" width="1638" height="1080"></canvas>
    <p id="warning_message"></p>
    </div>
    <div class="description">
        <b>Datei auswählen: </b>Hochladen von Bildern und PDF Dateien (erste 10 Seiten maximal) von Ihrem Computer<br>
        <b>Alle Bilder entfernen: </b>Löscht alle Bilder, die sich auf dieser Arbeitsfläche befinden. Dies hat keine Auswirkung auf das veröffentlichte Whiteboard<br>
        <b>Whiteboard veröffentlichen: </b>Überträgt die aktuelle Ansicht in das Whiteboard und überschreibt den bisherigen Whiteboard-Inhalt<br>
        <br>
        <b>Position verändern: </b>Markieren Sie das Element und ziehen Sie es einfach an die gewünschte Position<br>
        <b>Scrollen mit dem Mausrad: </b>Markieren Sie das Element und scrollen Sie mit dem Mausrad um das Element zu vergrössern oder zu verkleinern<br>
        <b>Rechtsklick auf Bild: </b>Löscht das einzelne Element von der Arbeitsfläche<br>
        <p>v.1.0 - Christian Fulde - Sidler Transport AG</p>
        
    </div>

    <script src="../js/backend.js"></script>
</body>

</html>