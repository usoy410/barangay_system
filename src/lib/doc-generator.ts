import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

/**
 * Generates a filled DOCX document from a template and data.
 */
export async function generateDocx(
  templateBuffer: ArrayBuffer,
  data: Record<string, unknown>,
  filename: string
) {
  try {
    const out = await generateDocxBlob(templateBuffer, data);
    
    // Save the file
    saveAs(out, filename);
    
    return true;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Generates a filled DOCX document as a Blob.
 */
export async function generateDocxBlob(
  templateBuffer: ArrayBuffer,
  data: Record<string, unknown>
) {
  const zip = new PizZip(templateBuffer);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (replace placeholders)
  doc.render(data);

  // Get the generated content as a blob
  return doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

/**
 * Standard tags for our barangay documents.
 * Admins should use these exact tags in their Word templates.
 */
export const DOCUMENT_TAGS = {
  FULL_NAME: '{fullName}',
  AGE: '{age}',
  CIVIL_STATUS: '{civilStatus}',
  BIRTHDAY: '{birthday}',
  OCCUPATION: '{occupation}',
  GENDER: '{gender}',
  ADDRESS: '{address}',
  PHONE: '{phoneNo}',
  PURPOSE: '{purpose}',
  DATE: '{currentDate}',
};
