function processPdf(pdf, stage) {
  const totalPages = Math.min(pdf.numPages, 10);  // Limit the total pages to 10
  let currentPage = 1;

  function renderNextPage() {
    if (currentPage > totalPages) return;

    pdf.getPage(currentPage).then(page => {
      const scale = 3;  // Skalierungsfaktor, je nach Bedarf anpassen
      const viewport = page.getViewport({ scale: scale });
      const canvas = document.createElement('canvas');
      const wrapper = document.createElement('div');

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      wrapper.style.width = Math.floor(viewport.width / scale) + 'pt';
      wrapper.style.height = Math.floor(viewport.height / scale) + 'pt';
      wrapper.appendChild(canvas);

      const context = canvas.getContext('2d');

      // Zusätzliche Render-Optionen
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        textLayer: null,
        enhanceTextSelection: true,
        renderInteractiveForms: false,
        transform: undefined,
        imageLayer: null,
        canvasFactory: undefined,
        background: undefined,
        intent: "print", // oder "print"
        antialias: true  // Anti-Aliasing aktiviert
      };

      const renderTask = page.render(renderContext);

      renderTask.promise.then(() => {
        const x = (currentPage - 1) * (viewport.width / scale) - (currentPage - 1) * 50;  // 50px Überlappung
        const imageObj = new Image();

        imageObj.onload = function() {
          addImageToStage(imageObj, stage, x);
          currentPage++;
          renderNextPage();
        };

        imageObj.src = canvas.toDataURL();
      });
    });
  }

  renderNextPage();
}

