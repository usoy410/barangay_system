import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

/**
 * Generates a filled DOCX document from a template and data.
 * 
 * @param templateBuffer - The raw binary of the .docx template
 * @param data - Object containing the values for the placeholders (e.g. { name: 'John' })
 * @param filename - The name of the resulting file to be saved
 */
export async function generateDocx(
  templateBuffer: ArrayBuffer,
  data: Record<string, any>,
  filename: string
) {
  try {
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (replace placeholders)
    doc.render(data);

    // Get the generated content as a blob
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Save the file
    saveAs(out, filename);
    
    return true;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Standard tags for our barangay documents.
 * Admins should use these exact tags in their Word templates.
 */
export const DOCUMENT_TAGS = {
  FULL_NAME: '{fullName}',
  PURPOSE: '{purpose}',
  DATE: '{currentDate}',
};
