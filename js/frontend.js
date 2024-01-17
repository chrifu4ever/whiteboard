const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;

// ... Code zum Zeichnen von Objekten ...
function drawObjects(filepath) {
  console.log("Gezeichnet");

  const scaleX = 2;
  const scaleY = 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach((obj, index) => {
    let newX = obj.x * scaleX;
    let newY = obj.y * scaleY;
    let newWidth = obj.content.width * scaleX;
    let newHeight = obj.content.height * scaleY;

    // Prüfe, ob es sich um eine SVG-Datei handelt
    let isSvg = obj.filepath.endsWith(".svg");

    // Schatten für alle Objekte und weiße Hintergründe
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;

    // Zeichne weißen Hintergrund für SVG-Objekte
    if (isSvg) {
      ctx.fillStyle = "white";
      ctx.fillRect(newX, newY, newWidth, newHeight); // Skalierte Position und Größe
    }

    // Entferne Schatten für SVG-Bild, lasse ihn aber für den Hintergrund
    if (isSvg) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Zeichne das Bild
    ctx.drawImage(obj.content, newX, newY, newWidth, newHeight);

    // Wende den Schatten erneut an für nachfolgende Objekte
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;

    // Zeichne einen 1px Rand um das Objekt
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(newX, newY, newWidth, newHeight);

    // Zeichne eine Umrandung, wenn das Objekt ausgewählt ist
    if (currentObjectIndex === index) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(newX, newY, newWidth, newHeight);
    }
  });
}

const scaleX = 0.5; // Umkehrung des Skalierungsfaktors (1 / 2)
const scaleY = 0.5; // Umkehrung des Skalierungsfaktors (1 / 2)

// ... Code zum Verschieben von Objekten ...
canvas.addEventListener("mousedown", function (e) {
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = (e.clientX - canvasRect.left) * scaleX;
  const mouseY = (e.clientY - canvasRect.top) * scaleY;
  let found = false;

  objects
    .slice()
    .reverse()
    .forEach((obj, index) => {
      if (
        !found &&
        mouseX > obj.x &&
        mouseX < obj.x + obj.content.width &&
        mouseY > obj.y &&
        mouseY < obj.y + obj.content.height
      ) {
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
canvas.addEventListener("mousemove", function (e) {
  if (isDragging) {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) * scaleX;
    const mouseY = (e.clientY - canvasRect.top) * scaleY;
    objects[currentObjectIndex].x = mouseX - dragStartPoint.x;
    objects[currentObjectIndex].y = mouseY - dragStartPoint.y;
    drawObjects();
  }
});

// ... Code zum Ändern der Größe von Objekten ...
canvas.addEventListener("mouseup", function () {
  isDragging = false;
  resizing = false;
});

// ... Code zum Ändern der Größe von Objekten ...
canvas.addEventListener("mouseout", function () {
  isDragging = false;
});

//TOUCH EVENTS
canvas.addEventListener("touchstart", function (e) {
  const canvasRect = canvas.getBoundingClientRect();
  const touchX = (e.touches[0].clientX - canvasRect.left) * scaleX;
  const touchY = (e.touches[0].clientY - canvasRect.top) * scaleY;
  let found = false;

  objects
    .slice()
    .reverse()
    .forEach((obj, index) => {
      if (
        !found &&
        touchX > obj.x &&
        touchX < obj.x + obj.content.width &&
        touchY > obj.y &&
        touchY < obj.y + obj.content.height
      ) {
        isDragging = true;
        dragStartPoint.x = touchX - obj.x;
        dragStartPoint.y = touchY - obj.y;
        currentObjectIndex = objects.length - 1 - index;

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

canvas.addEventListener("touchmove", function (e) {
  if (isDragging) {
    const canvasRect = canvas.getBoundingClientRect();
    const touchX = (e.touches[0].clientX - canvasRect.left) * scaleX;
    const touchY = (e.touches[0].clientY - canvasRect.top) * scaleY;
    objects[currentObjectIndex].x = touchX - dragStartPoint.x;
    objects[currentObjectIndex].y = touchY - dragStartPoint.y;
    drawObjects();
  }
});

canvas.addEventListener("touchend", function () {
  isDragging = false;
  resizing = false;
});

function isNearEdge(mouseX, mouseY, obj) {
  const edgeThreshold = 10;
  const nearRightEdge =
    mouseX > obj.x + obj.content.width - edgeThreshold &&
    mouseX < obj.x + obj.content.width;
  const nearBottomEdge =
    mouseY > obj.y + obj.content.height - edgeThreshold &&
    mouseY < obj.y + obj.content.height;

  return nearRightEdge && nearBottomEdge;
}
function getResizeDirection(mouseX, mouseY, obj) {
  // Da wir nur die rechte untere Ecke betrachten
  return "bottom-right";
}

function resizeObject(mouseX, mouseY, obj, direction) {
  if (direction === "bottom-right") {
    const newWidth = mouseX - obj.x;
    const newHeight = mouseY - obj.y;

    // Stelle sicher, dass die Größe nicht kleiner als ein Minimum wird
    obj.content.width = Math.max(newWidth, 20);
    obj.content.height = Math.max(newHeight, 20);
  }
}

canvas.addEventListener("wheel", function (e) {
  if (currentObjectIndex !== null) {
    const obj = objects[currentObjectIndex];
    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9; // Vergrößern/Verkleinern

    // Direkte Skalierung für Bilder
    obj.content.width *= scaleFactor;
    obj.content.height *= scaleFactor;
    obj.width = obj.content.width; // Aktualisiere die Breite
    obj.height = obj.content.height; // Aktualisiere die Höhe
    drawObjects();
  }
});

function updateScreenSize() {
  let screenX = window.innerWidth;
  let screenY = window.innerHeight;
  document.getElementById("screenSizeInfoDiv").innerHTML =
    "Screen Size: " + screenX + " x " + screenY;
}

// Laden von Bildern aus JSON
window.onload = function () {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
  fetch("/php/loadJsonFrontend.php")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        loadAndAddImageFromJson(item);
      });
    })
    .catch((error) => console.error("Error:", error));
};

function loadAndAddImageFromJson(item) {
  const img = new Image();
  img.onload = function () {
    img.width = item.width;
    img.height = item.height;
    objects.push({
      type: "image",
      content: img,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      filepath: item.filepath,
    });
    drawObjects();
  };
  img.src = item.filepath;
}

// Funktion, um das Frontend neu zu laden
function reloadFrontend() {
  window.location.reload();
  console.log("Frontend neu geladen");
}

// Aktualisierung alle 10 Sekunden (10000 Millisekunden)
setInterval(reloadFrontend, 180000);


//Mauszeiger ausblenden nach 10Sekunden Inaktivität im Frontendlet mouseInactivityTimer = null;
let mouseInactivityTimer = null;

function hideCursor() {
    document.body.style.cursor = 'none';
}

function resetCursorInactivityTimer() {
    document.body.style.cursor = 'default';
    clearTimeout(mouseInactivityTimer);
    mouseInactivityTimer = setTimeout(hideCursor, 10000); // 10 Sekunden Inaktivität
}

// Event Listener für Mausbewegungen
document.addEventListener('mousemove', resetCursorInactivityTimer);

// Initialisieren des Timers beim Laden der Seite
resetCursorInactivityTimer();