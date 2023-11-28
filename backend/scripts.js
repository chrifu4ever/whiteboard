var storedPdfData = [];
var stage;




// Funktion, um die Bühnengröße festzulegen
function setStageSize(stage) {
    console.log('Setting stage size to ' + stageWidth + ' x ' + stageHeight);
    stage.width(stageWidth*0.8);
    stage.height(stageHeight);
}

// Erstelle die Bühne, wenn sie noch nicht existiert
if (!stage) {
    stage = createStage('output', window.innerWidth, window.innerHeight);  // Angenommen, createStage ist definiert oder importiert
    setStageSize(stage);
}

document.getElementById('pdfInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    
    var reader = new FileReader();
    reader.onload = function(evt) {
        switch (file.type) {
            case 'application/pdf':
                console.log('Eine PDF-Datei wurde geladen.');
                var pdfData = new Uint8Array(evt.target.result);
                storedPdfData.push(pdfData);
                pdfjsLib.getDocument({data: pdfData}).promise.then(pdf => processPdf(pdf, stage));  // Angenommen, processPdf ist definiert oder importiert
                break;
            case 'image/jpeg':
                console.log('Eine JPEG-Bilddatei wurde geladen.');
                processImage(evt.target.result, stage);  // Angenommen, processImage ist definiert oder importiert
                break;
            case 'image/png':
                console.log('Eine PNG-Bilddatei wurde geladen.');
                processImage(evt.target.result, stage);  // Angenommen, processImage ist definiert oder importiert
                break;
            case 'image/svg+xml':
                console.log('Eine SVG-Bilddatei wurde geladen.');
                processImage(evt.target.result, stage);  // Angenommen, processImage ist definiert oder importiert
                break;
            default:
                console.log('Unbekanntes Dateiformat.');
        }
    };

    if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
});  
document.getElementById('clearCanvasButton').addEventListener('click', function() {
    const decision = window.confirm("Sollen wirklich alle Elemente gelöscht werden?");
    if (decision) {
        clearCanvas();  // Angenommen, clearCanvas ist definiert oder importiert
    }
});

// Event Listener für Fenstergröße Änderung
window.addEventListener('resize', function() {
    setStageSize(stage);
});

function clearCanvas() {
    stage.children.forEach(layer => {
        layer.destroyChildren();
        layer.draw();
    });
}
