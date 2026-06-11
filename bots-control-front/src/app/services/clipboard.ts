const copyWithExecCommand = (text: string) => {
  const onCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
  };

  document.addEventListener('copy', onCopy);

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.removeEventListener('copy', onCopy);
  }
};

export const copyTextToClipboard = (text: string): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => {
      copyWithExecCommand(text);
    });
  }

  copyWithExecCommand(text);
  return Promise.resolve();
};
