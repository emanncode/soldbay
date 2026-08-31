import { Alert, Platform } from "react-native";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

/**
 * Cross-platform confirmation dialog that resolves with the user's choice.
 * Native: system Alert with Cancel/Confirm buttons.
 * Web: react-native-web's Alert is a no-op, so fall back to window.confirm.
 */
export function confirmDialog(
  options: ConfirmDialogOptions,
): Promise<boolean> {
  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    destructive = false,
  } = options;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelText, style: "cancel", onPress: () => resolve(false) },
        {
          text: confirmText,
          style: destructive ? "destructive" : "default",
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

export interface AlertDialogOptions {
  title: string;
  message?: string;
  buttonText?: string;
}

/**
 * Cross-platform informational alert. Resolves once the user dismisses it.
 */
export function alertDialog(options: AlertDialogOptions): Promise<void> {
  const { title, message, buttonText = "OK" } = options;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [{ text: buttonText, onPress: () => resolve() }],
      { cancelable: true, onDismiss: () => resolve() },
    );
  });
}