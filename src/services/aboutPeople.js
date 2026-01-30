import { supabase, getAuthenticatedClient } from '../lib/supabaseClient';

export const ABOUT_BUCKET = 'about';

const getWriteClient = () => {
  return getAuthenticatedClient();
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const getFileExt = (fileName = '') => {
  const parts = String(fileName).split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  return String(ext || '').toLowerCase();
};

export const pickLocalized = (language, valueKo, valueEn) => {
  const lang = language === 'en' ? 'en' : 'ko';
  if (lang === 'en') {
    return valueEn || valueKo || '';
  }
  return valueKo || '';
};

export const getPublicUrlForPath = (path) => {
  if (!path) return '';
  const { data } = supabase.storage.from(ABOUT_BUCKET).getPublicUrl(path);
  return data?.publicUrl || '';
};

export const uploadAboutPhoto = async ({ file, type, personId }) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const client = getWriteClient();

  const ext = getFileExt(file.name) || 'jpg';
  const safeType = type === 'ceo' ? 'ceo' : 'board';
  const id = personId || generateId();
  const objectId = generateId();
  const objectPath = `people/${safeType}/${id}/${objectId}.${ext}`;

  const { error: uploadError } = await client.storage
    .from(ABOUT_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const photoUrl = getPublicUrlForPath(objectPath);

  return {
    personId: id,
    photo_path: objectPath,
    photo_url: photoUrl,
  };
};

export const removeAboutPhoto = async (photoPath) => {
  if (!photoPath) return;
  const client = getWriteClient();
  const { error } = await client.storage.from(ABOUT_BUCKET).remove([photoPath]);
  if (error) throw error;
};

export const fetchAboutContent = async () => {
  const { data, error } = await supabase
    .from('about_people')
    .select('*')
    .order('type', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;

  const rows = data || [];
  const ceo = rows.find((r) => r.type === 'ceo') || null;
  const board = rows.filter((r) => r.type === 'board');
  return { ceo, board };
};

export const insertAboutPerson = async (row) => {
  const client = getWriteClient();
  const { error } = await client.from('about_people').insert([row]);
  if (error) throw error;
};

export const updateAboutPerson = async (id, patch) => {
  const client = getWriteClient();
  const { error } = await client.from('about_people').update(patch).eq('id', id);
  if (error) throw error;
};

export const deleteAboutPerson = async (id) => {
  const client = getWriteClient();
  const { error } = await client.from('about_people').delete().eq('id', id);
  if (error) throw error;
};
