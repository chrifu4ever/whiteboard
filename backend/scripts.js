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
    
    if (!file.type.match('application/pdf') && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Bitte eine PDF-, JPG- oder PNG-Datei hochladen!');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(evt) {
        if (file.type.match('application/pdf')) {
            var pdfData = new Uint8Array(evt.target.result);
            storedPdfData.push(pdfData);
            
            pdfjsLib.getDocument({data: pdfData}).promise.then(pdf => processPdf(pdf, stage));  // Angenommen, processPdf ist definiert oder importiert
        } else if (file.type.match('image/jpeg') || file.type.match('image/png')) {
            processImage(evt.target.result, stage);  // Angenommen, processImage ist definiert oder importiert
        }
    };
    
    if (file.type.match('application/pdf')) {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsDataURL(file);
    }
});

document.getElementById('clearButton').addEventListener('click', function() {
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
