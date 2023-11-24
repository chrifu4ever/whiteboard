<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sidler Dashboard Backend</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>


<input type="file" id="pdfInput" accept=".pdf, image/jpeg, image/png, image/svg+xml" style="display: none;" />
<button onclick="document.getElementById('pdfInput').click()" class="file-upload-button">Bild/PDF einlesen</button>
<button id="clear-canvas">Alles löschen</button>

<button id="goLiveToFrontend">Whiteboard veröffentlichen</button>




<button id="saveButton">Whiteboard speichern</button>
<input type="file" id="zipFileInput" accept=".zip" style="display: none;" />
<button onclick="document.getElementById('zipFileInput').click()" class="zipFile-upload-button">Whiteboard laden</button>
<!-- Dropdown für Bildschirmgröße -->
<select id="screenSizeDropdown">
    <option value="43">43 Zoll</option>
    <option value="50">50 Zoll</option>
    <option value="55" selected>55 Zoll</option>
    <option value="60">60 Zoll</option>
    <option value="65" selected>65 Zoll (Standard)</option>
    <option value="70">70 Zoll</option>
    <option value="75">75 Zoll</option>
    <option value="80">80 Zoll</option>
</select>
<select id="resolutionDropdown">
    <option value="hd">HD</option>
    <option value="fhd">Full HD</option>
    <option value="uhd" selected>4K</option>
</select>
<div id="output"></div>

<script src="pdfProcessor.js"></script>
<script src="imageProcessor.js"></script>
<script src="sizedoesmatter.js"></script> 
<script src="konvaManager.js"></script>
<script src="scripts.js"></script>
<script src="save.js"></script>
<script src="hotkeys.js"></script>

</body>
</html>
