import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/webpack';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const PDFViewer_aux = ({ base64String }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    getDocument({ data: byteArray }).promise.then(pdf => {
      const numPages = pdf.numPages;
      const pagePromises = [];

      const renderPage = pageNumber => {
        return pdf.getPage(pageNumber).then(page => {
          const viewport = page.getViewport({ scale: 1.5}); // Ajustar el valor de escala si es necesario
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const canvasWidth = viewport.width;
const canvasHeight = viewport.height;

canvas.height = canvasHeight;
canvas.width = canvasWidth;

const renderContext = {
  canvasContext: context,
  viewport: viewport
};

return page.render(renderContext).promise.then(() => {
  return canvas.toDataURL(); // Convertir el canvas a una URL de imagen
}).catch(error => {
  console.error('Error rendering page:', error);
  return null; // O cualquier otra acción que desees realizar en caso de error
});
        });
      };

      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(renderPage(i));
      }

      Promise.all(pagePromises).then(pageUrls => {
        setPages(pageUrls);
        setLoading(false);
      });
    });
  }, [base64String]);

  return (
    <div style={{ width: '100%', height: '800px', overflowX: 'auto', position: 'relative' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        pages.map((page, index) => (
          <img
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              marginBottom: '20px'

            }}
          />
        ))
      )}
    </div>
  );
};

export default PDFViewer_aux;
