# Task: Remove Canvas-Based PDF Generation

## Objective
Remove the support for PDF generation (jsPDF) since it might not be accurate, relying solely on `.docx` templating or other available document generation methods.

## Status
- [x] Investigate `src/lib/documents.ts` for jsPDF usage.
- [x] Remove `jsPDF` logic from `generateDocument` and any related code.
- [x] Check for other files calling `generateDocument` expecting a PDF.
- [x] Clean up dependencies (`jsPDF`) if no longer needed.
- [x] Update documentation (`DOCUMENT_GENERATION_GUIDE.md`) to reflect the removal of PDF support.
- [x] Final code review.
