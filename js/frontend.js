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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach((obj, index) => {
    // Setze Schatten nur für PDF-Objekte
    if (obj.type === "pdf") {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
    } else {
      // Kein Schatten für andere Objekte
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Zeichne das Objekt
    ctx.drawImage(
      obj.content,
      obj.x,
      obj.y,
      obj.content.width,
      obj.content.height
    );

    // Zeichne eine Umrandung, wenn das Objekt ausgewählt ist
    if (currentObjectIndex === index) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.content.width, obj.content.height);
    }
    updateJsonForObject(obj, index, filepath);
  });
}

// ... Code zum Verschieben von Objekten ...
canvas.addEventListener("mousedown", function (e) {
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;
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
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
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
  const touchX = e.touches[0].clientX - canvasRect.left;
  const touchY = e.touches[0].clientY - canvasRect.top;
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
    const touchX = e.touches[0].clientX - canvasRect.left;
    const touchY = e.touches[0].clientY - canvasRect.top;
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
