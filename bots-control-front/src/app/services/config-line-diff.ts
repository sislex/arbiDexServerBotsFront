import { diffLines } from 'diff';

export type ConfigLineKind = 'same' | 'removed' | 'added';

const splitLines = (value: string) => value.split('\n');

export const highlightLinesInText = (
  oldText: string,
  newText: string,
  side: 'left' | 'right',
): ConfigLineKind[] => {
  const parts = diffLines(oldText, newText);
  const result: ConfigLineKind[] = [];

  parts.forEach((part) => {
    const lines = splitLines(part.value.replace(/\n$/, ''));
    if (lines.length === 1 && lines[0] === '' && part.value === '') {
      return;
    }

    if (part.added) {
      if (side === 'right') {
        lines.forEach(() => result.push('added'));
      }
      return;
    }

    if (part.removed) {
      if (side === 'left') {
        lines.forEach(() => result.push('removed'));
      }
      return;
    }

    lines.forEach(() => result.push('same'));
  });

  return result;
};

export const padLineKinds = (lines: string[], kinds: ConfigLineKind[]): ConfigLineKind[] => {
  if (kinds.length >= lines.length) {
    return kinds.slice(0, lines.length);
  }

  return [...kinds, ...Array.from({ length: lines.length - kinds.length }, () => 'same' as const)];
};

export const padLineKindsToCount = (kinds: ConfigLineKind[], count: number): ConfigLineKind[] => {
  if (kinds.length >= count) {
    return kinds.slice(0, count);
  }

  return [...kinds, ...Array.from({ length: count - kinds.length }, () => 'same' as const)];
};
