import { supabase } from './supabase';

export async function uploadImage(file: File): Promise<string> {
  try {
    // Log the file details
    console.log('Starting upload with file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      throw new Error('Please upload a JPG or PNG image file.');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `cat-images/${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload directly using the File object
    const { data, error } = await supabase.storage
      .from('cat-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful, data:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cat-photos')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}