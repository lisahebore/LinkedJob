import { Alert } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/** Every destructive action goes through this so none can be triggered by a single tap. */
export function confirmDestructive({ title, message, confirmLabel, onConfirm }: ConfirmOptions) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
