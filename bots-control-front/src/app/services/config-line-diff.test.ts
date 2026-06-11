import { describe, expect, it } from 'vitest';
import { highlightLinesInText } from './config-line-diff';

describe('config-line-diff', () => {
  it('marks removed lines on the left and added lines on the right', () => {
    const oldText = '{\n  "a": 1,\n  "b": 2\n}';
    const newText = '{\n  "a": 1,\n  "b": 3\n}';

    expect(highlightLinesInText(oldText, newText, 'left')).toContain('removed');
    expect(highlightLinesInText(oldText, newText, 'right')).toContain('added');
  });
});
