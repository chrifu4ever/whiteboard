// Auflösungen
const hd_width = 1280;
const hd_height = 720;
const fhd_width = 1920;
const fhd_height = 1080;
const uhd_width = 3840;
const uhd_height = 2160;


let MAX_HEIGHT_Coefficient = 0.43; //Standard-Koeffizient bei 55 Zoll und Full HD

let screenSize = 55; //Standard- ScreenSize
let screenResolution = "fhd"; //Standard - Resolution

let stageWidth = 1920*0.8;
let stageHeight = 1080;


// Event-Listener für das Dropdown der Bildschirmgröße
document.getElementById('screenSizeDropdown').addEventListener('change', function() {
    screenSize = parseInt(this.value);
    updateCoefficient(screenSize, screenResolution);
    console.log("Screen-Size auf "+screenSize);
});

// Event-Listener für das Dropdown der Auflösung
document.getElementById('resolutionDropdown').addEventListener('change', function() {
    screenResolution = this.value;
    updateCoefficient(screenSize, screenResolution);
    console.log("Screen-Resolution auf "+ screenResolution);
});

// Funktion, um den Koeffizienten zu aktualisieren
function updateCoefficient(size, resolution) {
    const A4_Height_mm = 297; // Höhe von A4 in mm
    let screenDiagonal_mm;
    
    // Diagonale des Bildschirms in mm berechnen (angenommen 16:9-Verhältnis)
    switch(size) {
        case 43: screenDiagonal_mm = 43 * 25.4; break;
        case 50: screenDiagonal_mm = 50 * 25.4; break;
        case 55: screenDiagonal_mm = 55 * 25.4; break;
        case 60: screenDiagonal_mm = 60 * 25.4; break;
        case 65: screenDiagonal_mm = 65 * 25.4; break;
        case 70: screenDiagonal_mm = 70 * 25.4; break;
        case 75: screenDiagonal_mm = 75 * 25.4; break;
        case 80: screenDiagonal_mm = 80 * 25.4; break;
        default: return;
    }

    // Auswahl der Auflösung
    switch(resolution) {
        case 'hd': 
            stageWidth = hd_width*0.8; 
            stageHeight = hd_height; 
            console.log("Neue Grösse: "+stageWidth+' x '+ stageHeight)
            setStageSize(stage);
            break;
        case 'fhd': 
            stageWidth = fhd_width*0.8; 
            stageHeight = fhd_height; 
            console.log("Neue Grösse: "+stageWidth+' x '+ stageHeight)
            setStageSize(stage);
            break;
        case 'uhd': 
            stageWidth = uhd_width*0.8; 
            stageHeight = uhd_height;
            console.log("Neue Grösse: "+stageWidth+' x '+ stageHeight)
            setStageSize(stage);
            break;
        default: return;
    }

    const aspectRatio = stageWidth / stageHeight;
    const screen_Height_mm = Math.sqrt((Math.pow(screenDiagonal_mm, 2)) / (1 + Math.pow(aspectRatio, 2)));

    MAX_HEIGHT_Coefficient = A4_Height_mm / screen_Height_mm;
}
