const pdfUrl = 'Caibalion41p.pdf';
const pdfViewer = document.getElementById('pdf-viewer');
const overlay = document.getElementById('overlay');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;

// Carregar o documento PDF
function loadPdf() {
  const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
  loadingTask.promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
  }).catch(error => {
    console.error('Error loading PDF:', error);
  });
}

// Renderizar a página PDF
function renderPage(num) {
  pageRendering = true;

  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    pdfViewer.height = viewport.height;
    pdfViewer.width = viewport.width;

    const renderContext = {
      canvasContext: pdfViewer.getContext('2d'),
      viewport: viewport
    };

    page.render(renderContext).promise.then(() => {
      pageRendering = false;
    });
  });

  pageNum = num;
}

// Carregar o PDF ao carregar a página
loadPdf();

// Adicionar ouvintes de eventos aos botões
prevPageBtn.addEventListener('click', () => onPrevPage());
nextPageBtn.addEventListener('click', () => onNextPage());

// Funções para navegar entre páginas
function onPrevPage() {
  if (pageNum <= 1) return;
  queueRenderPage(pageNum - 1);
}

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  queueRenderPage(pageNum + 1);
}

// Função para enfileirar a renderização da página
function queueRenderPage(num) {
  if (pageRendering) {
    setTimeout(() => queueRenderPage(num), 100);
  } else {
    renderPage(num);
  }
}
