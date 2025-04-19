import { PDFDocument } from "pdf-lib";

export const parsePdf = async (buffer) => {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    const pages = pdfDoc.getPages();
    let extractedText = "";

    for (const page of pages) {
      const textContent = await page.getTextContent();
      extractedText +=
        textContent.items.map((item) => item.str).join(" ") + "\n";
    }

    return extractedText.trim();
  } catch (err) {
    console.error("PDF parsing error:", err);
    return "";
  }
};
