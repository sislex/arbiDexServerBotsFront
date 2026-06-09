import { toast, type ExternalToast } from 'sonner';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, message: string) => {
  if (type === 'success') {
    toast.success(message);
    return;
  }
  if (type === 'error') {
    toast.error(message);
    return;
  }
  toast(message);
};

interface DelayedActionToastOptions {
  message: string;
  cancelLabel: string;
  durationMs?: number;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  toastOptions?: ExternalToast;
}

export const showDelayedActionToast = ({
  message,
  cancelLabel,
  durationMs = 4000,
  onConfirm,
  onCancel,
  toastOptions,
}: DelayedActionToastOptions) => {
  let cancelled = false;

  const toastId = toast(message, {
    duration: durationMs,
    position: 'bottom-center',
    ...toastOptions,
    action: {
      label: cancelLabel,
      onClick: () => {
        cancelled = true;
        onCancel?.();
        toast.dismiss(toastId);
      },
    },
  });

  const timeoutId = window.setTimeout(async () => {
    if (cancelled) {
      return;
    }
    toast.dismiss(toastId);
    await onConfirm();
  }, durationMs);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    onCancel?.();
    toast.dismiss(toastId);
  };
};
