console.log('Konva Manager sssloaded.');

let selectedNode = null;
let lastX = 20, lastY = 20;

function addImageToStage(img, stage, x = null, y = null, rotation = null, scaleX = null, scaleY = null, useScaling = false) {
    console.log('Adding image to stage.');
    let scale = 1;
    const MAX_HEIGHT = MAX_HEIGHT_Coefficient * stage.height();
    console.log("A4 Koeffizient:" + MAX_HEIGHT_Coefficient);

    if (!useScaling) {
        if (img.height > MAX_HEIGHT) {
            scale = MAX_HEIGHT / img.height;
        }
    } else {
        scale = 1;
    }

    const layer = new Konva.Layer();
    stage.add(layer);

    const attributes = {
        x: x || 20,
        y: y || 20,  
        image: img,
        draggable: true,
        shadowColor: 'black',
        shadowBlur: 30,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.6,
        rotation: rotation || 0,
        scaleX: scaleX || scale,
        scaleY: scaleY || scale,
        dragBoundFunc: function(pos) {
            const stageSize = stage.size();
            const newX = Math.min(Math.max(pos.x, 0), stageSize.width - this.width() * this.scaleX());
            const newY = Math.min(Math.max(pos.y, 0), stageSize.height - this.height() * this.scaleY());
            return {
                x: newX,
                y: newY
            };
        }
    };

    const konvaImage = new Konva.Image(attributes);
    layer.add(konvaImage);

    const tr = new Konva.Transformer({
        nodes: [konvaImage],
        centeredScaling: true,
        rotationSnaps: [0, 90, 180, 270],
        visible: false
    });

    layer.add(tr);

    konvaImage.on('click', function () {
        tr.nodes([konvaImage]);
        tr.visible(true);
        layer.draw();
        selectedNode = konvaImage;
    });

    stage.on('click', function (e) {
        if (e.target !== konvaImage) {
            tr.visible(false);
            layer.draw();
        }
    });

    layer.draw();
}

function createStage(container) {
    console.log('Creating Konva stage.');
    const stage = new Konva.Stage({
        container: container,
        width: 1920,
        height: 1080
    });
    initializeHotkeys(stage);
    return stage;
}

function initializeHotkeys(stage) {
    stage.on('click tap', function (e) {
        if (e.target === stage) {
            selectedNode = null;
        } else {
            selectedNode = e.target;
        }
    });
}

function loadFromZip(fileInputId, stage) {
    console.log('Loading from Zip.');
    const input = document.getElementById(fileInputId);
    const file = input.files[0];
    const zip = new JSZip();

    zip.loadAsync(file)
        .then(function (contents) {
            return zip.file('state.json').async('text');
        })
        .then(function (text) {
            const state = JSON.parse(text);
            const promises = [];

            state.elements.forEach((element) => {
                const promise = zip.file(element.imgName).async('base64')
                    .then((base64) => {
                        const img = new Image();
                        img.src = 'data:image/png;base64,' + base64;

                        return new Promise((resolve) => {
                            img.onload = () => {
                                addImageToStage(
                                    img,
                                    stage,
                                    element.x,
                                    element.y,
                                    element.rotation,
                                    element.scaleX,
                                    element.scaleY,
                                    true  
                                );
                                resolve();
                            };
                            });
                    });

                promises.push(promise);
            });

            return Promise.all(promises);
        })
        .then(() => {
            console.log('Alle Bilder geladen');
        })
        .catch((error) => {
            console.log('Fehler beim Laden der ZIP', error);
        });
}

document.getElementById('zipFileInput').addEventListener('change', function () {
    loadFromZip('zipFileInput', stage);
});


function saveKonvaAsImage(stage) {
    console.log('Speichere Konva als Bild.');
    const dataURL = stage.toDataURL({ pixelRatio: 3 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'KonvaBild.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('saveImageButton').addEventListener('click', function() {
    saveKonvaAsImage(stage);  // Ersetze 'stage' mit deinem tatsächlichen Konva Stage-Objekt
});
