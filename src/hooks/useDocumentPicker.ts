import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { PickedFile } from '../types/files';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../utils/constants';

export function useDocumentPicker() {
  const [isPicking, setIsPicking] = useState(false);

  /** Resolves to the chosen file, or null if cancelled. Rejects with a readable error if invalid. */
  const pick = useCallback(async (): Promise<PickedFile | null> => {
    setIsPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED_MIME_TYPES,
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return null;

      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? '';
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new Error('Only PDF and Word documents are allowed.');
      }
      if (asset.size === undefined || asset.size === 0) {
        throw new Error('That file looks empty. Choose a different one.');
      }
      if (asset.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('That file is larger than 5 MB. Choose a smaller one.');
      }
      return { name: asset.name, uri: asset.uri, size: asset.size, mimeType };
    } finally {
      setIsPicking(false);
    }
  }, []);

  return { pick, isPicking };
}
