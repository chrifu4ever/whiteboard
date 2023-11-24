const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (file.type.match('image.*')) {
        handleImageUpload(file);
    } else if (file.type === 'application/pdf') {
        handlePdfUpload(file);
    }
});

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

function handlePdfUpload(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            // Beschränke die Anzahl der Seiten auf 10 oder die Gesamtzahl der Seiten im PDF
            const maxPages = Math.min(10, pdf.numPages);
            let pagesProcessed = 0;

            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
                pdf.getPage(pageNum).then(function(page) {
                    const viewport = page.getViewport({ scale: 1 });
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };
                    page.render(renderContext).promise.then(function() {
                        pagesProcessed++;
                        objects.push({ type: 'pdf', content: canvas, x: 0, y: 100 * (pagesProcessed - 1) });
                        drawObjects();

                        // Lösche das zusätzliche Canvas, wenn alle Seiten verarbeitet wurden
                        if (pagesProcessed === maxPages) {
                            canvas.remove();
                        }
                    });
                });
            }
        });
    };

    reader.readAsArrayBuffer(file);
}




function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj, index) => {
        if (obj.type === 'pdf') {
            // Schatten für PDF-Objekte
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            ctx.shadowColor = 'transparent';
        }

        ctx.drawImage(obj.content, obj.x, obj.y);

        // Zeichne eine Umrandung, wenn das Objekt ausgewählt ist
        if (currentObjectIndex === index) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, obj.content.width, obj.content.height);
        }
    });

    // Schatten zurücksetzen
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

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

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mouseout', function() {
    isDragging = false;
});




function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects = [];
}
