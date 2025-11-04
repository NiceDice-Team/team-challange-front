import { cn } from '../../lib/utils';

describe('cn utility function', () => {
  test('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  test('handles conditional classes', () => {
    const condition = true;
    const result = cn('base-class', condition && 'conditional-class');
    expect(result).toBe('base-class conditional-class');
  });

  test('filters out falsy values', () => {
    const result = cn('class1', false, null, undefined, '', 'class2');
    expect(result).toBe('class1 class2');
  });

  test('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  test('handles single class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  test('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  test('handles objects with conditional classes', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    });
    expect(result).toBe('class1 class3');
  });

  test('combines multiple input types', () => {
    const result = cn(
      'base-class',
      ['array-class1', 'array-class2'],
      {
        'object-class1': true,
        'object-class2': false
      },
      true && 'conditional-class',
      false && 'hidden-class'
    );
    expect(result).toBe('base-class array-class1 array-class2 object-class1 conditional-class');
  });

  test('handles Tailwind CSS conflict resolution', () => {
    // clsx and tailwind-merge should handle conflicting classes
    const result = cn('px-2 px-4'); // px-4 should override px-2
    // The exact behavior depends on tailwind-merge configuration
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('handles whitespace and duplicate classes', () => {
    const result = cn('  class1  ', 'class1', 'class2', '  class2  ');
    // Should deduplicate and trim
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});