import { toast } from 'sonner';

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
