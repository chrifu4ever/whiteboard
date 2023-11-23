<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sidler Transport Whiteboard</title>
    <link rel="stylesheet" href="whiteboard-frontend.css">
    <script src="https://unpkg.com/konva@7.2.5/konva.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/konva/9.0.0/konva.min.js"></script>
</head>

<body>

    <div id="main-div">

        <div id="canvas-div">
            
        </div>
        
        <div id="right-div">
            <img class="logo" src="img/sidler_transporte-Logo_ohne Rahmen.png">
            <div id="birthday-div">
                <h2>Geburtstage</h2>
                <p>Wir wünschen alles Gute zum Geburtstag</p>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                        01.01.2023</p>
                    </div>
                </div>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                        01.01.2023</p>
                    </div>
                </div>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                        01.01.2023</p>
                    </div>
                </div>
           
        
            </div>
            <div id="other-div">
                <button id="updateCanvasButton">Update Canvas</button>
                <h2>Ein- & Austritte</h2>
                <p>Gerne informieren wir euch über die aktuellen Ein- & Austritte:</p>
                <h3><b>Eintritt per 01.11.2023</b></h3>
                
            </div>
        </div>
    </div>

    <script>

// JavaScript
let lastModified = null;
// JavaScript
window.onload = loadCanvas;
function loadCanvas() {
    // Fetch the public.zip file
    fetch('../files/public.zip')
    .then(response => {
        // Check if the file has been modified
        const newLastModified = response.headers.get('Last-Modified');
        if (lastModified && lastModified === newLastModified) {
            console.log('File not modified');
            throw new Error('File not modified');
        }
        console.log('File has been modified');

        lastModified = newLastModified;

        // Read the response as a blob
        return response.blob();
    })
    .then(JSZip.loadAsync)
    .then(zip => {
        // Get the state.json file
        return zip.file('state.json').async('text').then(JSON.parse).then(state => {
            // Create a new Konva Stage
            const stage = new Konva.Stage({
                container: 'canvas-div',
                width: state.stageSize.width,
                height: state.stageSize.height
            });

            // Create a new Konva Layer
            const layer = new Konva.Layer();
            stage.add(layer);

            // For each image in the state, create a new Konva Image
            const imagePromises = state.elements.map(element => {
                return zip.file(element.imgName).async('base64').then(imgDataUrl => {
                    return new Promise(resolve => {
                        const img = new Image();
                        img.onload = function() {
                            const konvaImg = new Konva.Image({
                                image: img,
                                x: element.x,
                                y: element.y,
                                width: element.width,
                                height: element.height,
                                rotation: element.rotation
                            });
                            layer.add(konvaImg);
                            resolve();
                        };
                        img.src = 'data:image/png;base64,' + imgDataUrl;
                    });
                });
            });

            // When all images are loaded, draw the layer
            return Promise.all(imagePromises).then(() => layer.draw());
        });
    })
    .catch((error) => {
        if (error.message !== 'File not modified') {
            console.error('Error:', error);
        }
    });
}

setInterval(loadCanvas, 1000);
    </script>


</body>

</html>
