<!DOCTYPE html>
<html>

<head>
    <title>Sidler Whiteboard backend</title>
    <link rel="stylesheet" href="../css/backend.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>

<body>

    <div id="menu-container">
        <input type="file" id="fileInputButton" accept="image/*,application/pdf">
        <button id="clearCanvasButton">Clear Canvas</button>
        <!--  <button id="saveButton">Canvas Speichern</button> -->
        <button id="goLiveWhiteboardButton">Whiteboard veröffentlichen</button>

    </div>
    <div id="canvas-container">
    <canvas id="main-canvas" width="1638" height="1080"></canvas>
    <p id="warning_message"></p>
    </div>


    <script src="../js/backend.js"></script>
</body>

</html>