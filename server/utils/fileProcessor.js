import fs from 'fs/promises';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'; // Import the direct implementation, not the index.js
import mammoth from 'mammoth';

export async function extractTextFromFile(filePath, mimetype) {
    try {
      // Check if the file exists
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }
  
    if (mimetype === 'text/plain') {
      return await fs.readFile(filePath, 'utf8');
    } else if (mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer); // Pass the buffer directly
      return data.text;
    } else if (
      mimetype === 'application/msword' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  }
