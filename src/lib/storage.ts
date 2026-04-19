import { supabase } from './supabase';

const BUCKET_NAME = 'document-templates';

/**
 * Uploads a .docx template to Supabase Storage.
 * Automatically handles renaming based on type.
 */
export async function uploadTemplate(file: File, type: 'Clearance' | 'Indigency') {
  const fileExt = 'docx';
  const fileName = `${type}_Template.${fileExt}`;
  const filePath = `templates/${fileName}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true, // Overwrite existing template
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

  if (error) {
    console.error(`Error uploading ${type} template:`, error);
    throw error;
  }

  return data;
}

/**
 * Gets the public URL for a specific template type.
 */
export async function getTemplateUrl(type: 'Clearance' | 'Indigency') {
  const fileName = `${type}_Template.docx`;
  const filePath = `templates/${fileName}`;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Checks if a template exists in storage.
 */
export async function checkTemplateExists(type: 'Clearance' | 'Indigency') {
  const fileName = `${type}_Template.docx`;
  const filePath = `templates/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list('templates', {
      search: fileName
    });

  if (error || !data || data.length === 0) {
    return false;
  }

  return true;
}

/**
 * Deletes a template from storage.
 */
export async function deleteTemplate(type: 'Clearance' | 'Indigency') {
  const fileName = `${type}_Template.docx`;
  const filePath = `templates/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error(`Error deleting ${type} template:`, error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Template not found or could not be deleted.');
  }

  return true;
}

/**
 * Uploads an incident photo to Supabase Storage.
 * @param file - The image file to upload.
 * @returns The public URL of the uploaded image.
 */
export async function uploadIncidentPhoto(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('incident-photos')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading incident photo:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('incident-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}
