const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;



// ... Code zum Laden von Bildern und PDFs ...
document.getElementById('fileInputButton').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('../php/fileUpload.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Senden der Dateiinformationen an saveToJson.php
        const fileInfo = {
            filetype: file.type.includes('image') ? 'image' : 'pdf',
            filepath: data.filePath
        };
       

        if (file.type.match('image.*')) {
            handleImageUpload(file, data.filePath);
        } else if (file.type === 'application/pdf') {
            handlePdfUpload(file, data.filePath);
        }
    })
    .catch(error => console.error('Error:', error));
});


// Bild hochladen
function handleImageUpload(file, filepath) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const imageObject = {
                type: 'image', 
                content: img, 
                x: 0, 
                y: 0, 
                width: img.width, 
                height: img.height, 
                filepath: filepath
            };
            objects.push(imageObject);
            drawObjects();
            updateJsonForObject(imageObject, objects.length - 1); // Speichere die Bildinformationen in der JSON-Datei
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}


// Canvas löschen
document.getElementById('clearCanvasButton').addEventListener('click', function() {
    const userConfirmation = confirm("Möchtest du wirklich alle Elemente vom Canvas löschen?");

    if (userConfirmation) {
        clearCanvas();
        clearFilesDirectory();
    }
});


function clearCanvas() {
    // Lösche alle Objekte auf dem Canvas
    objects = [];
    drawObjects(); // Zeichne das Canvas neu, um die Änderungen anzuzeigen
}

function clearFilesDirectory() {
    // Sende Anfrage an PHP-Server, um Dateien im ../files/ Ordner zu löschen
    fetch('/php/clearFilesDirectory.php', { method: 'POST' })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error:', error));
}

// PDF hochladen

let pdfDocument = null;


function handlePdfUpload(file, filepath) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument({ data: typedarray }).promise.then(pdf => {
            pdfDocument = pdf; // Speichere die PDF-Dokument-Instanz global
            renderPdfPages(pdf, filepath);
        });
    };

    reader.readAsArrayBuffer(file);
}



function renderPdfPages(pdf, filepath, item = null) {
    const maxPages = Math.min(10, pdf.numPages); // oder eine andere Logik, um die Seitenanzahl zu begrenzen
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        pdf.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
                const obj = {
                    type: 'pdf',
                    content: canvas,
                    x: item ? item.x : 0, // Verwende x-Wert aus 'item', wenn vorhanden, sonst 0
                    y: item ? item.y + 100 * (pageNum - 1) : 100 * (pageNum - 1), // Ähnlich für y-Wert
                    width: item ? item.width : viewport.width, // Ähnlich für Breite
                    height: item ? item.height : viewport.height, // Ähnlich für Höhe
                    pageNum: pageNum,
                    filepath: filepath
                };
                objects.push(obj);
                drawObjects();
            });
        });
    }
}


// ... Code zum Zeichnen von Objekten ...
function drawObjects(filepath) {
    console.log("Gezeichnet");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj, index) => {
        // Setze Schatten nur für PDF-Objekte
        if (obj.type === 'pdf') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            // Kein Schatten für andere Objekte
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // Zeichne das Objekt
        ctx.drawImage(obj.content, obj.x, obj.y, obj.content.width, obj.content.height);

        // Zeichne eine Umrandung, wenn das Objekt ausgewählt ist
        if (currentObjectIndex === index) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, obj.content.width, obj.content.height);
        }
        updateJsonForObject(obj, index, filepath);
    });
}

function updateJsonForObject(obj, index) {
    const fileInfo = {
        type: obj.type,
        filepath: obj.filepath,
        x: obj.x,
        y: obj.y,
        width: obj.width, 
        height: obj.height, 
        page: obj.type === 'pdf' ? obj.pageNum : undefined,
        index: index 
    };
    updateJsonFile(fileInfo);
}

function updateJsonFile(fileInfo) {
    fetch('/php/saveToJson.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileInfo)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}



// ... Code zum Verschieben von Objekten ...
canvas.addEventListener('mousedown', function(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    let found = false;

    objects.slice().reverse().forEach((obj, index) => {
        if (!found && mouseX > obj.x && mouseX < obj.x + obj.content.width && mouseY > obj.y && mouseY < obj.y + obj.content.height) {
            isDragging = true;
            dragStartPoint.x = mouseX - obj.x;
            dragStartPoint.y = mouseY - obj.y;
            currentObjectIndex = objects.length - 1 - index; // Da wir die Liste umgekehrt durchlaufen

            // Bringe das ausgewählte Objekt in den Vordergrund
            const selectedObject = objects.splice(currentObjectIndex, 1)[0];
            objects.push(selectedObject);
            currentObjectIndex = objects.length - 1;

            found = true;
        }
    });

    if (!found) {
        currentObjectIndex = null;
    }

    drawObjects();
});

// ... Code zum Ändern der Größe von Objekten ...
canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        objects[currentObjectIndex].x = mouseX - dragStartPoint.x;
        objects[currentObjectIndex].y = mouseY - dragStartPoint.y;
        drawObjects();
    }
});


// ... Code zum Ändern der Größe von Objekten ...
canvas.addEventListener('mouseup', function() {
    isDragging = false;
    resizing = false;
});

// ... Code zum Ändern der Größe von Objekten ...
canvas.addEventListener('mouseout', function() {
    isDragging = false;
});


//TOUCH EVENTS
canvas.addEventListener('touchstart', function(e) {
    const canvasRect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - canvasRect.left;
    const touchY = e.touches[0].clientY - canvasRect.top;
    let found = false;

    objects.slice().reverse().forEach((obj, index) => {
        if (!found && touchX > obj.x && touchX < obj.x + obj.content.width && touchY > obj.y && touchY < obj.y + obj.content.height) {
            isDragging = true;
            dragStartPoint.x = touchX - obj.x;
            dragStartPoint.y = touchY - obj.y;
            currentObjectIndex = objects.length - 1 - index;

            const selectedObject = objects.splice(currentObjectIndex, 1)[0];
            objects.push(selectedObject);
            currentObjectIndex = objects.length - 1;

            found = true;
        }
    });

    if (!found) {
        currentObjectIndex = null;
    }

    drawObjects();
});

canvas.addEventListener('touchmove', function(e) {
    if (isDragging) {
        const canvasRect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - canvasRect.left;
        const touchY = e.touches[0].clientY - canvasRect.top;
        objects[currentObjectIndex].x = touchX - dragStartPoint.x;
        objects[currentObjectIndex].y = touchY - dragStartPoint.y;
        drawObjects();
    }
});

canvas.addEventListener('touchend', function() {
    isDragging = false;
    resizing = false;
});


function isNearEdge(mouseX, mouseY, obj) {
    const edgeThreshold = 10;
    const nearRightEdge = mouseX > obj.x + obj.content.width - edgeThreshold && mouseX < obj.x + obj.content.width;
    const nearBottomEdge = mouseY > obj.y + obj.content.height - edgeThreshold && mouseY < obj.y + obj.content.height;

    return nearRightEdge && nearBottomEdge;
}
function getResizeDirection(mouseX, mouseY, obj) {
    // Da wir nur die rechte untere Ecke betrachten
    return 'bottom-right';
}

function resizeObject(mouseX, mouseY, obj, direction) {
    if (direction === 'bottom-right') {
        const newWidth = mouseX - obj.x;
        const newHeight = mouseY - obj.y;

        // Stelle sicher, dass die Größe nicht kleiner als ein Minimum wird
        obj.content.width = Math.max(newWidth, 20);
        obj.content.height = Math.max(newHeight, 20);
    }
}


canvas.addEventListener('wheel', function(e) {
    if (currentObjectIndex !== null) {
        const obj = objects[currentObjectIndex];
        const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9; // Vergrößern/Verkleinern

        if (obj.type === 'image') {
            // Direkte Skalierung für Bilder
            obj.content.width *= scaleFactor;
            obj.content.height *= scaleFactor;
            obj.width = obj.content.width; // Aktualisiere die Breite
            obj.height = obj.content.height; // Aktualisiere die Höhe
            drawObjects();
        } else if (obj.type === 'pdf') {
            // Skalierung für PDF-Seiten
            scalePdf(obj, scaleFactor, obj.pageNum);
        }
    }
});


function scalePdf(obj, scaleFactor) {
    if (!pdfDocument) {
        console.error("PDF-Dokument ist nicht geladen.");
        return;
    }

    pdfDocument.getPage(obj.pageNum).then(page => {
        const currentScale = obj.currentScale || 1;
        const newScale = currentScale * scaleFactor;
        obj.currentScale = newScale;

        const viewport = page.getViewport({ scale: newScale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            obj.content = canvas;
            obj.width = viewport.width; // Aktualisiere die Breite
            obj.height = viewport.height; // Aktualisiere die Höhe
            drawObjects(); // Zeichne die Objekte neu, um das JSON zu aktualisieren
        });
    });
}



// Whiteboard veröffentlichen und speichern im saved-Ordner
document.getElementById('goLiveWhiteboardButton').addEventListener('click', function() {
    if (objects.length > 0) {
        const userConfirmation = confirm("Möchtest du das aktuelle Whiteboard veröffentlichen? Dadurch wird das bisherige Whiteboard überschrieben und dieses angezeigt.");

        if (userConfirmation) {
            copyFilesToSaved();
        }
    } else {
        alert("Es gibt keine Objekte auf dem Whiteboard, die veröffentlicht werden können.");
    }
});

function copyFilesToSaved() {
    fetch('../php/copyFiles.php', { method: 'POST' })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error:', error));
}


//Einzelne Elemente löschen vom Canvas, aus der JSON und aus dem Ordner wenn keine Elemente mehr vorhanden sind
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();

    if (currentObjectIndex !== null) {
        // Entferne das Objekt vom Canvas
        objects.splice(currentObjectIndex, 1);

        // Sende Anfrage zum Entfernen des Objekts aus der JSON-Datei
        removeFromJson(currentObjectIndex);

        // Setze die Markierung zurück und zeichne das Canvas neu
        currentObjectIndex = null;
        drawObjects();
    }
});

function removeFromJson(index) {
    fetch('/php/removeFromJson.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index: index })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}



window.onload = function() {
    let loadedImagesCount = 0;
    let totalImagesCount = 0;

    fetch('/php/loadJson.php')
    .then(response => response.json())
    .then(data => {
        totalImagesCount = data.filter(item => item.type === 'image').length;

        data.forEach(item => {
            if (item.type === 'image') {
                loadAndAddImage(item, () => {
                    loadedImagesCount++;
                    if (loadedImagesCount === totalImagesCount) {
                        drawObjects();
                    }
                });
            } else if (item.type === 'pdf') {
                loadAndAddPdf(item);
            }
        });
    })
    .catch(error => console.error('Error:', error));
};


function loadAndAddImage(item, callback) {
    const img = new Image();
    img.onload = function() {
        img.width = item.width;
        img.height = item.height;

        objects.push({
            type: 'image',
            content: img,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            filepath: item.filepath
        });

        callback();
    };
    img.src = item.filepath;
}

function loadAndAddPdf(item) {
    // Lade die PDF-Datei von ihrem Pfad
    fetch(item.filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const typedarray = new Uint8Array(buffer);

        pdfjsLib.getDocument({ data: typedarray }).promise.then(pdf => {
            // Rufe für jede Seite die renderPdfPages Funktion mit den Werten aus der JSON-Datei auf
            for (let pageNum = 1; pageNum <= pdf.numPages && pageNum <= 10; pageNum++) {
                renderPdfPages(pdf, item.filepath, item.x, item.y, item.width, item.height, pageNum);
            }
        });
    })
    .catch(error => console.error('Error beim Laden der PDF:', error));
}

