const sortById = (left: unknown, right: unknown) =>
  String((left as Record<string, unknown>)?.id ?? '').localeCompare(
    String((right as Record<string, unknown>)?.id ?? ''),
    undefined,
    { numeric: true },
  );

export const sortObjectKeysDeep = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeysDeep(item));
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};

    Object.keys(record)
      .sort()
      .forEach((key) => {
        sorted[key] = sortObjectKeysDeep(record[key]);
      });

    return sorted;
  }

  return value;
};

export const extractBotsRulesList = (parsed: unknown): unknown[] => {
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const list = (parsed as Record<string, unknown>).botsRulesList;
    if (Array.isArray(list)) {
      return list;
    }
  }

  return [];
};

export const formatConfigObjectForDiff = (parsed: unknown): string => {
  const sortedRules = [...extractBotsRulesList(parsed)].sort(sortById).map((rule) => sortObjectKeysDeep(rule));

  return JSON.stringify(sortObjectKeysDeep({ botsRulesList: sortedRules }), null, 2);
};

export const formatConfigForDiff = (raw: string): string => {
  try {
    return formatConfigObjectForDiff(JSON.parse(raw));
  } catch {
    return raw;
  }
};
