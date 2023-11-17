console.log('Hotkeys loaded.');


let copiedNode = null;
const stageHistory = [];

/*
Funktionen für Copy, Paste, Undo folgt in V2.0

*/

// Funktion zum Speichern des aktuellen Zustands der Bühne
function saveStageState(stage) {
    stageHistory.push(stage.toJSON());
}

// Funktion zum Wiederherstellen des letzten Zustands
function undoStageState(stage) {
    const lastState = stageHistory.pop();
    if (lastState) {
        stage.clear();
        Konva.Node.create(lastState, 'containerId');  // Ersetze 'containerId' durch die tatsächliche ID deines Containers
    }
}

// Event Listener für Tastendrücke
document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete' || event.key === 'Del') {
        if (selectedNode) {
            console.log('Entferne ausgewähltes Objekt:', selectedNode);
            console.log('Zugehöriges Layer:', selectedNode.getLayer());
    
            saveStageState(selectedNode.getStage());
    
            // Speichere den Layer vor dem Zerstören des Knotens
            const layer = selectedNode.getLayer();
    
            selectedNode.destroy();
            selectedNode = null;
    
            // Zeichne den Layer neu
            if (layer) {
                layer.draw();
            }
        } else {
            console.log('Kein Objekt ausgewählt.');
        }
    }
     else if (event.ctrlKey && event.key === 'c') {
        if (selectedNode) {
            console.log('Kopiere ausgewähltes Objekt.');
            copiedNode = selectedNode.clone();
        }
    } else if (event.ctrlKey && event.key === 'v') {
        if (copiedNode) {
            console.log('Füge kopiertes Objekt ein.');
            const stage = selectedNode ? selectedNode.getStage() : null;  // Ersetze durch deine tatsächliche Bühne, falls nicht verfügbar
            if (stage) {
                saveStageState(stage);
                const layer = new Konva.Layer();
                stage.add(layer);
                layer.add(copiedNode);
                layer.draw();
            }
        }
    } else if (event.ctrlKey && event.key === 'z') {
        console.log('Mache letzte Aktion rückgängig.');
        const stage = selectedNode ? selectedNode.getStage() : null;  // Ersetze durch deine tatsächliche Bühne, falls nicht verfügbar
        if (stage) {
            undoStageState(stage);
        }
    }
});
