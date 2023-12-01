const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;
let pdfDocument = null;


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



//lädt das aktuelle canvas wenn dateien im ordner sind
window.onload = function() {

    console.log("Lade Whiteboard aus savedFiles");
    // 
    fetch('/php/loadJsonFrontend.php')
    .then(response => response.json())
    .then(data => {
        // Verarbeite jede Datei aus der JSON-Daten
        data.forEach(item => {
            if (item.type === 'image') {
                // Lade Bild und füge es zum Canvas hinzu
                loadAndAddImage(item);
            } else if (item.type === 'pdf') {
                // Lade PDF und füge es zum Canvas hinzu
                loadAndAddPdf(item);
            }
        });
    })
    .catch(error => console.error('Error:', error));
};

function loadAndAddImage(item) {
    console.log("Lade Bild");
    const img = new Image();
    img.onload = function() {
        objects.push({
            type: 'image',
            content: img,
            x: item.x, 
            y: item.y, 
            width: item.width, 
            height: item.height, 
            filepath: item.filepath
        });
        drawObjects();
    };
    img.src = item.filepath; // Setze den Pfad zur Bilddatei
}

function loadAndAddPdf(item) {
    console.log("Lade PDF");
    // Lade die PDF-Datei von ihrem Pfad
    fetch(item.filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const typedarray = new Uint8Array(buffer);

        pdfjsLib.getDocument({ data: typedarray }).promise.then(pdf => {
            renderPdfPages(pdf, item.filepath, item);
        });
    })
    .catch(error => console.error('Error beim Laden der PDF:', error));
    
}



function renderPdfPages(pdf, filepath, item = null) {
    console.log("Render PDF");
    const maxPages = Math.min(10, pdf.numPages); // oder eine andere Logik, um die Seitenanzahl zu begrenzen
    for (let pageNum = 10; pageNum <= maxPages; pageNum++) {
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
                                const obj = {
                    type: 'pdf',
                    content: canvas,
                    x: item ? item.x : 0, // Verwende x-Wert aus 'item', wenn vorhanden, sonst 0
                    y: item ? item.y + 100 * (pageNum - 1) : 100 * (pageNum - 1), // Ähnlich für y-Wert
                    pageNum: pageNum,
                    filepath: filepath
                };
                objects.push(obj);
                drawObjects();
            });
        });
    }
}


function scalePdf(obj, scaleFactor) {
    console.log("Skaliere PDF");
    if (!pdfDocument) {
        console.error("PDF-Dokument ist nicht geladen.");
        return;
    }

    pdfDocument.getPage(obj.pageNum).then(page => {
        console.log("Skaliere PDF Seite "+obj.pageNum+" um "+scaleFactor);
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

// ... Code zum Zeichnen von Objekten ...
function drawObjects() {
    console.log("Gezeichnet");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj, index) => {
        // Setze Schatten nur für PDF-Objekte
        if (obj.type === 'pdf') {
            console.log("Setze Schatten");
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