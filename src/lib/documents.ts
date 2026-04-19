import { jsPDF } from 'jspdf';
import type { Resident } from '@/types/database';

/**
 * Library for generating official Barangay documents.
 * Handles layout coordination, typography, and PDF export.
 */

interface DocumentOptions {
  resident: Resident;
  purpose: string;
  type: 'Clearance' | 'Indigency';
  officialName: string;
  officialPosition: string;
}

/**
 * Generates a standard Barangay Clearance or Certificate of Indigency.
 * 
 * @param options - Required data for document generation.
 * @returns The PDF document instance.
 */
export const generateDocument = (options: DocumentOptions) => {
  const { resident, purpose, type, officialName, officialPosition } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  // 1. Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Republic of the Philippines', centerX, 15, { align: 'center' });
  doc.text('Province of Example', centerX, 20, { align: 'center' });
  doc.text('Municipality of Example', centerX, 25, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('BARANGAY EXAMPLE', centerX, 35, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 40, pageWidth - 20, 40);

  // 2. Title Section
  doc.setFontSize(18);
  doc.text(type === 'Clearance' ? 'BARANGAY CLEARANCE' : 'CERTIFICATE OF INDIGENCY', centerX, 55, { align: 'center' });

  // 3. Body Section
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const bodyText = type === 'Clearance' 
    ? `TO WHOM IT MAY CONCERN:\n\nThis is to certify that ${resident.first_name} ${resident.last_name}, of legal age, ${resident.civil_status}, and a resident of ${resident.address}, is known to be a person of good moral character and has no derogatory record on file in this office.\n\nThis clearance is being issued upon his/her request for ${purpose}.\n\nIssued this ${today} at Barangay Example.`
    : `TO WHOM IT MAY CONCERN:\n\nThis is to certify that ${resident.first_name} ${resident.last_name}, of legal age, ${resident.civil_status}, and a resident of ${resident.address}, is one of the indigent families in this Barangay.\n\nThis certificate is being issued upon his/her request for ${purpose}.\n\nIssued this ${today} at Barangay Example.`;

  const splitText = doc.splitTextToSize(bodyText, pageWidth - 40);
  doc.text(splitText, 20, 75);

  // 4. Signature Section
  const signatureY = 180;
  doc.setFont('helvetica', 'bold');
  doc.text(officialName.toUpperCase(), pageWidth - 70, signatureY, { align: 'center' });
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 100, signatureY + 2, pageWidth - 40, signatureY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(officialPosition, pageWidth - 70, signatureY + 7, { align: 'center' });

  // 5. Footer / Seal Note
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Not valid without official seal', 20, 270);
  doc.text(`Doc ID: ${resident.id.slice(0, 8)}-${Date.now().toString().slice(-4)}`, pageWidth - 20, 270, { align: 'right' });

  return doc;
};

/**
 * Triggers a browser download of the generated document.
 */
export const downloadDocument = (doc: jsPDF, filename: string) => {
  doc.save(`${filename}.pdf`);
};
