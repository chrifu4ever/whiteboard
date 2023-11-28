const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;



// ... Code zum Laden von Bildern und PDFs ...
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (file.type.match('image.*')) {
        handleImageUpload(file);
    } else if (file.type === 'application/pdf') {
        handlePdfUpload(file);
    }

    // Datei hochladen
    const formData = new FormData();
    formData.append('file', file);

    fetch('file_upload.php', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Error:', error));
});

// Bild hochladen
function handleImageUpload(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            objects.push({ type: 'image', content: img, x: 0, y: 0 });
            drawObjects();
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Canvas löschen
document.getElementById('clearCanvasButton').addEventListener('click', function() {
    clearCanvas();
});
// PDF hochladen

let pdfDocument = null;


function handlePdfUpload(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument({ data: typedarray }).promise.then(pdf => {
            pdfDocument = pdf; // Speichere die PDF-Dokument-Instanz global
            renderPdfPages(pdf);
        });
    };

    reader.readAsArrayBuffer(file);
}



function renderPdfPages(pdf) {
    const maxPages = Math.min(10, pdf.numPages);
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        pdf.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
                objects.push({
                    type: 'pdf',
                    content: canvas,
                    x: 0,
                    y: 100 * (pageNum - 1),
                    pageNum: pageNum
                });
                drawObjects();
            });
        });
    }
}

// ... Code zum Zeichnen von Objekten ...
function drawObjects() {
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
    });
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



// canvas zurücksetzen
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects = [];
   
}


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
            drawObjects();
        });
    });
}



function saveCanvasAsImage() {
    const canvas4k = document.createElement('canvas');
    canvas4k.width = 3840; // 4K Breite
    canvas4k.height = 2160; // 4K Höhe
    const ctx = canvas4k.getContext('2d');

    const scaleFactor = 3840 / document.getElementById('main-canvas').width;

    const renderPromises = objects.map(obj => {
        if (obj.type === 'pdf') {
            // Verwende scalePdf, um das PDF auf dem neuen Canvas zu skalieren und zu rendern
            return scalePdf(obj, scaleFactor, ctx);
        } else {
            // Skalieren und zeichnen für Bilder
            const scaledX = obj.x * scaleFactor;
            const scaledY = obj.y * scaleFactor;
            const scaledWidth = obj.content.width * scaleFactor;
            const scaledHeight = obj.content.height * scaleFactor;
            ctx.drawImage(obj.content, scaledX, scaledY, scaledWidth, scaledHeight);
            return Promise.resolve();
        }
    });

    Promise.all(renderPromises).then(() => {
        // Nachdem alle Objekte gerendert wurden, verarbeite das Canvas-Bild
        const imageData = canvas4k.toDataURL('image/jpeg');
        sendCanvasToServer(imageData);
    });
}

// Füge einen Event-Listener zum Save-Button hinzu
document.getElementById('saveButton').addEventListener('click', saveCanvasAsImage);
