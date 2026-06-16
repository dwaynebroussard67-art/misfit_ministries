import { supabase } from './supabase';

// Load all editable content as a key -> value map
export async function loadAllContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('content').select('key, value');
  if (error) {
    console.error('CMS load error:', error.message);
    return {};
  }
  const map: Record<string, string> = {};
  (data || []).forEach((row: any) => { map[row.key] = row.value; });
  return map;
}

// Save (insert or update) one piece of content
export async function saveContent(key: string, value: string): Promise<boolean> {
  const { error } = await supabase
    .from('content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) {
    console.error('CMS save error:', error.message);
    return false;
  }
  return true;
}

// Upload an image to the media bucket, return its public URL
export async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file);
  if (error) {
    console.error('Image upload error:', error.message);
    return null;
  }
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}
