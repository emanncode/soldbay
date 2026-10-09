import { Alert, AlertButton } from 'react-native';

/**
 * A standard informative dialog with a single "OK" button.
 */
export const helpfulDialog = (title: string, message: string, onOk?: () => void) => {
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
};

/**
 * A confirmation dialog offering a primary action and a "Cancel" action.
 */
export const confirmDialog = (
  title: string,
  message: string,
  onConfirm: () => void,
  options?: {
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onCancel?: () => void;
  }
) => {
  const opts = options || {};
  const buttons: AlertButton[] = [
    { text: opts.cancelText || 'Cancel', style: 'cancel', onPress: opts.onCancel },
    { 
      text: opts.confirmText || 'Confirm', 
      style: opts.isDestructive ? 'destructive' : 'default', 
      onPress: onConfirm 
    }
  ];
  Alert.alert(title, message, buttons);
};

/**
 * A dialog offering multiple arbitrary actions.
 */
export const actionSheetDialog = (
  title: string,
  message: string,
  buttons: AlertButton[]
) => {
  Alert.alert(title, message, buttons);
};
