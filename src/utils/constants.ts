export const DOCUMENT_BUCKET = 'documents';
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
/** How long a download link stays valid. Short, because anyone holding it can open the file. */
export const SIGNED_URL_TTL_SECONDS = 120;
export const CANDIDATE_LIMIT = 100;
export const MAX_SKILLS = 20;
