const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
let objects = [];
let isDragging = false;
let resizing = false;
let resizeDirection;
let dragStartPoint = {};
let currentObjectIndex = null;
let nextXPosition = 0; // Globale Variable für die nächste X-Position
const padding = 10; // Abstand zwischen den Bildern

// ... Code zum Laden von Bildern und PDFs ...
document
  .getElementById("fileInputButton")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("../php/fileUpload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (file.type.match("image.*")) {
          // Verarbeite Bild-Upload
          if (data.filePath) {
            loadAndAddImage(data.filePath);
          }
        } else if (file.type === "application/pdf") {
          // Verarbeite PDF-Upload
          if (Array.isArray(data.svgFiles)) {
            data.svgFiles.forEach((svgFile) => {
              loadAndAddImage(svgFile);
            });
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  });

// Bild hochladen und positionieren
function loadAndAddImage(filePath) {
  const img = new Image();
  img.onload = function () {
    let width = img.width;
    let height = img.height;
    const maxHeight = canvas.height - 200; // Maximale Höhe, etwas kleiner als die Canvas-Höhe

    // Skaliere das Bild, um das Seitenverhältnis zu bewahren und die Höhe zu begrenzen
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }

    // Berechne die X-Position für das aktuelle Bild
    let posX = nextXPosition + padding;

    // Prüfe, ob das Bild innerhalb des Canvas passt
    if (posX + width > canvas.width) {
      posX = padding; // Beginne eine neue Zeile
      nextXPosition = 0; // Setze die X-Position zurück
    }

    // Füge das Bildobjekt der Objektliste hinzu
    objects.push({
      type: "image",
      content: img,
      x: posX,
      y: 0, // Y-Position kann konstant sein, wenn Sie die Bilder in einer Reihe anordnen möchten
      width: width,
      height: height,
      filepath: filePath,
    });

    // Aktualisiere die nächste X-Position für das nächste Bild
    nextXPosition = posX + width;

    // Zeichne alle Objekte auf dem Canvas neu
    drawObjects();
  };
  img.onerror = function () {
    console.error("Fehler beim Laden des Bildes: " + filePath);
  };
  img.src = filePath;
}
// Canvas löschen
document
  .getElementById("clearCanvasButton")
  .addEventListener("click", function () {
    const userConfirmation = confirm(
      "Möchtest du wirklich alle Elemente vom Canvas löschen?"
    );

    if (userConfirmation) {
      clearCanvas();
      clearFilesDirectory();
    }
  });

function clearCanvas() {
  // Lösche alle Objekte auf dem Canvas
  objects = [];
  drawObjects(); // Zeichne das Canvas neu, um die Änderungen anzuzeigen
}

function clearFilesDirectory() {
  // Sende Anfrage an PHP-Server, um Dateien im ../files/ Ordner zu löschen
  fetch("/php/clearFilesDirectory.php", { method: "POST" })
    .then((response) => response.json())
    .then((data) => console.log(data.message))
    .catch((error) => console.error("Error:", error));
}

// ... Code zum Zeichnen von Objekten ...
function drawObjects(filepath) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach((obj, index) => {
    // Prüfe, ob es sich um eine SVG-Datei handelt
    let isSvg = obj.filepath.endsWith(".svg");

    // Schatten für alle Objekte
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // Zeichne weißen Hintergrund für SVG-Objekte
    if (isSvg) {
      ctx.fillStyle = "white";
      ctx.fillRect(obj.x, obj.y, obj.content.width, obj.content.height);
    }

    // Entferne Schatten von SVG-Objekt, aber lasse ihn auf dem Hintergrund
    if (isSvg) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    ctx.drawImage(
      obj.content,
      obj.x,
      obj.y,
      obj.content.width,
      obj.content.height
    );
    // Wende den Schatten erneut an für nachfolgende Objekte
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;

    // Zeichne einen 1px Rand um das Objekt
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(obj.x, obj.y, obj.content.width, obj.content.height);

    // Zeichne eine Umrandung, wenn das Objekt ausgewählt ist
    if (currentObjectIndex === index) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.content.width, obj.content.height);
    }

    updateJsonForObject(obj, index, filepath);
  });
}

function updateJsonForObject(obj, index) {
  const fileInfo = {
    type: obj.type,
    filepath: obj.filepath,
    x: obj.x,
    y: obj.y,
    width: obj.width,
    height: obj.height,
    index: index,
  };
  updateJsonFile(fileInfo);
}

function updateJsonFile(fileInfo) {
  fetch("/php/saveToJson.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileInfo),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
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
    const originalWidth = obj.content.width;
    const originalHeight = obj.content.height;
    const aspectRatio = originalWidth / originalHeight;
    const change = e.deltaY < 0 ? 20 : -20; // 10px größer oder kleiner

    // Neue Breite und Höhe berechnen, während das Seitenverhältnis beibehalten wird
    let newWidth = Math.max(originalWidth + change, 20); // Stelle sicher, dass die Größe nicht zu klein wird
    let newHeight = newWidth / aspectRatio;

    // Aktualisiere die Größe des Bildes
    obj.content.width = newWidth;
    obj.content.height = newHeight;
    obj.width = newWidth; // Aktualisiere die Breite
    obj.height = newHeight; // Aktualisiere die Höhe

    drawObjects();
  }
});

// Whiteboard veröffentlichen und speichern im saved-Ordner
document
  .getElementById("goLiveWhiteboardButton")
  .addEventListener("click", function () {
    if (objects.length > 0) {
      const userConfirmation = confirm(
        "Möchtest du das aktuelle Whiteboard veröffentlichen? Dadurch wird das bisherige Whiteboard überschrieben und dieses angezeigt."
      );

      if (userConfirmation) {
        fetch("/php/copyFiles.php", { method: "POST" })
          .then((response) => response.json())
          .then((data) => console.log(data.message))
          .catch((error) => console.error("Error:", error));
      }
    } else {
      alert(
        "Es gibt keine Objekte auf dem Whiteboard, die veröffentlicht werden können."
      );
    }
  });

//Einzelne Elemente löschen vom Canvas, aus der JSON und aus dem Ordner wenn keine Elemente mehr vorhanden sind
canvas.addEventListener("contextmenu", function (e) {
  e.preventDefault();

  if (currentObjectIndex !== null) {
    // Entferne das Objekt vom Canvas
    objects.splice(currentObjectIndex, 1);

    // Sende Anfrage zum Entfernen des Objekts aus der JSON-Datei
    removeFromJson(currentObjectIndex);

    // Setze die Markierung zurück und zeichne das Canvas neu
    currentObjectIndex = null;
    drawObjects();
  }
});

function removeFromJson(index) {
  fetch("/php/removeFromJson.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ index: index }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

// Laden von Bildern und PDFs aus JSON
window.onload = function () {
  fetch("/php/loadJson.php")
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
