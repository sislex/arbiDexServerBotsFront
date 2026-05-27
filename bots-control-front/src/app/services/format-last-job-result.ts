const toPrettyJson = (value: unknown): string => {
  if (value == null) {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

export const formatLastJobResult = (value: unknown): string => {
  if (value == null || value === '-') {
    return '-';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return '-';
    }

    try {
      return toPrettyJson(JSON.parse(trimmed) as unknown);
    } catch {
      return trimmed;
    }
  }

  return toPrettyJson(value);
};
