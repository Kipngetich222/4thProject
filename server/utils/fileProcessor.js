import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import mammoth from "mammoth";

/**
 * Extracts text from a file based on its MIME type.
 * Supports: PDF, TXT, DOC/DOCX (Word)
 */
export async function extractTextFromFile(filePath, mimetype) {
  try {
    // Check if file exists
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Handle PDF files
  if (mimetype === "application/pdf") {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfDoc = await PDFDocument.load(dataBuffer);
      const pages = pdfDoc.getPages();
      let extractedText = "";

      // Extract text from each page
      for (const page of pages) {
        const textContent = await page.getTextContent();
        extractedText +=
          textContent.items.map((item) => item.str).join(" ") + "\n";
      }

      return extractedText.trim();
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Failed to extract text from PDF");
    }
  }
  // Handle plain text files
  else if (mimetype === "text/plain") {
    return await fs.readFile(filePath, "utf8");
  }
  // Handle Word documents (DOC/DOCX)
  else if (
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  // Unsupported file type
  else {
    throw new Error("Unsupported file type");
  }
}
