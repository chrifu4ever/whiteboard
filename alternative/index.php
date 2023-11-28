<!DOCTYPE html>
<html>

<head>
    <title>Draggable Images and PDFs</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>

<body>

    <div id="menu-container">
        <input type="file" id="file-input" accept="image/*,application/pdf">
        <button id="clearCanvasButton">Clear Canvas</button>
        <button id="saveButton">Canvas Speichern</button>

    </div>
    <div id="canvas-container">
        <canvas id="main-canvas" width="1920" height="1080"></canvas>
    </div>
    <script src="script.js"></script>
</body>

</html>