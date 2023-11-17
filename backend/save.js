function saveState(stage) {
    console.log('Saving state.');
    const zip = new JSZip();
    const elements = [];

    stage.children.forEach((layer) => {
        layer.children.forEach((node) => {
            if (node.className === 'Image') {
                // Klonen des Knotens und Zurücksetzen der Rotation
                const clone = node.clone({ rotation: 0 });
                const imgDataUrl = clone.toDataURL();

                const imgName = `image_${node._id}.png`;
                zip.file(imgName, imgDataUrl.split('base64,')[1], {base64: true});

                const width = node.width() * node.scaleX();
                const height = node.height() * node.scaleY();
                const x = node.x();
                const y = node.y();
                const rotation = node.rotation();

                elements.push({
                    x, y, width, height, rotation, imgName
                });
            }
        });
    });

    // Speichere Stage-Größe und Elemente zusammen
    const state = {
        stageSize: {
            width: stage.width(),
            height: stage.height()
        },
        elements
    };

    const stateJSON = JSON.stringify(state, null, 2);
    zip.file('state.json', stateJSON);

    zip.generateAsync({ type: 'blob' })
    .then(function(blob) {
        console.log('Downloading zip.');
        saveAs(blob, 'state.zip');
    });
}

// Bind to a button for testing
document.getElementById('saveButton').addEventListener('click', function() {
    saveState(stage);
});
