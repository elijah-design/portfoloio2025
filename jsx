import React, { useEffect, useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";

const PDF_URL = "https://cdn.jsdelivr.net/gh/elijah-design/portfolio-flipbook/2025%20cv%20portfolio%20no%20password.pdf";
const DOWNLOAD_PASSWORD = "Portfolio2025";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function PDFPageFlipViewer() {
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [pdfPages, setPdfPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef();

  useEffect(() => {
    if (passwordEntered) {
      loadPdf();
    }
    // eslint-disable-next-line
  }, [passwordEntered]);

  const loadPdf = async () => {
    setLoading(true);
    const loadingTask = pdfjsLib.getDocument(PDF_URL);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pagesArr = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      pagesArr.push(canvas.toDataURL());
    }
    setPdfPages(pagesArr);
    setLoading(false);
  };

  const checkPassword = (e) => {
    e.preventDefault();
    if (passwordInputRef.current.value === DOWNLOAD_PASSWORD) {
      setPasswordEntered(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!passwordEntered) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <form onSubmit={checkPassword}>
          <h3>Enter Password to View Portfolio</h3>
          <input
            type="password"
            ref={passwordInputRef}
            placeholder="Enter password"
            style={{ padding: 10, fontSize: 16 }}
          />
          <button style={{ marginLeft: 10, padding: 10, fontSize: 16 }}>View</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>Loading PDF...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <HTMLFlipBook width={500} height={700} showCover={true}>
        {pdfPages.map((img, idx) => (
          <div key={idx} className="page">
            <img src={img} alt={`Page ${idx + 1}`} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}

export default PDFPageFlipViewer;
