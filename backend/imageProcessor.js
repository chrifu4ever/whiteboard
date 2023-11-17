function processImage(dataUrl, stage) {
    const img = new Image();
    img.onload = function() {
        let x = stage.width() - window.innerWidth;
        addImageToStage(img, stage, x);
        console.log("Bild")
    };
    img.src = dataUrl;
}