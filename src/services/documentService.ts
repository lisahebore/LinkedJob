import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../lib/supabase';
import { PickedFile } from '../types/files';
import { DocumentRow } from '../types/models';
import { DOCUMENT_BUCKET, SIGNED_URL_TTL_SECONDS } from '../utils/constants';

export async function listDocuments(ownerId: string): Promise<DocumentRow[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as DocumentRow[];
}

export async function getDocument(id: string): Promise<DocumentRow | null> {
  const { data, error } = await supabase.from('documents').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as DocumentRow | null;
}

function safeFileName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]/g, '_');
}


/** Uploads a PDF to private storage, then records it in the database. */
export async function createDocument(input: {
  ownerId: string;
  label: string;
  file: PickedFile;
}): Promise<DocumentRow> {
  const { ownerId, label, file } = input;

  const storagePath = `${ownerId}/${Date.now().toString(36)}-${safeFileName(file.name)}`;

  // Read the selected local file as binary data.
const response = await fetch(file.uri);

if (!response.ok) {
  throw new Error('Could not read the selected PDF file.');
}

const fileData = await response.arrayBuffer();

if (fileData.byteLength === 0) {
  throw new Error('The selected PDF file is empty.');
}

  // Upload the PDF bytes directly instead of using FormData.
  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(storagePath, fileData, {
      contentType: file.mimeType || 'application/pdf',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Save the document record after the file upload succeeds.
  const { data, error } = await supabase
    .from('documents')
    .insert({
      owner_id: ownerId,
      label: label.trim(),
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.mimeType || 'application/pdf',
      size_bytes: file.size,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath]);
    throw error;
  }

  return data as DocumentRow;
}


export async function updateDocumentLabel(id: string, label: string): Promise<DocumentRow> {
  const { data, error } = await supabase
    .from('documents')
    .update({ label: label.trim() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DocumentRow;
}

/** Deletes the record first (that is what the access rules guard), then the stored file. */
export async function deleteDocument(document: DocumentRow): Promise<void> {
  const { error } = await supabase.from('documents').delete().eq('id', document.id);
  if (error) throw error;
  await supabase.storage.from(DOCUMENT_BUCKET).remove([document.storage_path]);
}

/** A short-lived link. Storage rules decide who may create one: the owner, or an accepted company. */
export async function getDocumentUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}
