import {
    formatNumber,
    calculateCharCount,
    countWords,
    countSentences,
    calculateReadingTime,
    generateFrequencyMap,
    generateDensityHTML,
    shouldShowLimitWarning,
    shouldShowLimitError,
    getMessageColor
  } from '../js/pureFunctions.js';
  
  // Utility Functions Tests
  describe('formatNumber', () => {
    test('adds leading zero to single digit', () => {
      expect(formatNumber(5)).toBe('05');
    });
  
    test('does not modify double digits', () => {
      expect(formatNumber(42)).toBe('42');
    });
  
    test('handles zero correctly', () => {
      expect(formatNumber(0)).toBe('00');
    });
  });
 
  // Character Count Tests
  describe('calculateCharCount', () => {
    test('counts all characters when including spaces', () => {
      expect(calculateCharCount('Hello world', false)).toBe(11);
    });
  
    test('excludes spaces when specified', () => {
      expect(calculateCharCount('Hello world', true)).toBe(10);
    });
  
    test('handles empty string', () => {
      expect(calculateCharCount('', false)).toBe(0);
    });
  
    test('handles string with only spaces', () => {
      expect(calculateCharCount('   ', false)).toBe(3);
      expect(calculateCharCount('   ', true)).toBe(0);
    });
  });
  
// Word Count Tests
  describe('countWords', () => {
    test('counts words correctly with normal text', () => {
      expect(countWords('Hello world').length).toBe(2);
    });
  
    test('handles empty string', () => {
      expect(countWords('').length).toBe(0);
    });
  
    test('handles multiple spaces between words', () => {
      expect(countWords('Hello    world').length).toBe(2);
    });
  
    test('ignores leading and trailing spaces', () => {
      expect(countWords('  Hello world  ').length).toBe(2);
    });
  });
  
// Sentence Count Tests
  describe('countSentences', () => {
    test('counts sentences ending with periods', () => {
      expect(countSentences('This is a sentence. This is another.').length).toBe(2);
    });
  
    test('counts sentences ending with different punctuation', () => {
      expect(countSentences('Hello! How are you? I am fine.').length).toBe(3);
    });
  
    test('ignores empty sentences', () => {
      expect(countSentences('Hello..   World!').length).toBe(2);
    });
  
    test('handles empty string', () => {
      expect(countSentences('').length).toBe(0);
    });
  });
  
  // Reading Time Tests
  describe('calculateReadingTime', () => {
    test('returns "<1 min" for less than 200 words', () => {
      expect(calculateReadingTime(150)).toBe('<1 min');
    });
  
    test('returns "1 min" for exactly 200 words', () => {
      expect(calculateReadingTime(200)).toBe('1 min');
    });
  
    test('returns "1 min" for between 200 and 300 words', () => {
      expect(calculateReadingTime(250)).toBe('1 min');
    });
  
    test('rounds correctly for longer texts', () => {
      expect(calculateReadingTime(500)).toBe('3 mins');
    });
  });
  
  // Letter Density Tests
  describe('generateFrequencyMap', () => {
    test('counts character frequencies correctly', () => {
      const result = generateFrequencyMap(['a', 'b', 'a', 'c', 'b', 'a']);
      expect(result).toEqual({ a: 3, b: 2, c: 1 });
    });
  
    test('handles empty array', () => {
      expect(generateFrequencyMap([])).toEqual({});
    });
  });
  
  describe('generateDensityHTML', () => {
    test('creates HTML with correct percentages', () => {
      const letters = [['a', 3], ['b', 1]];
      const html = generateDensityHTML(letters, 4);
      
      expect(html).toContain('A');
      expect(html).toContain('B');
      expect(html).toContain('75.00%');
      expect(html).toContain('25.00%');
    });
  });
  
  
  describe('shouldShowLimitWarning', () => {
    test('returns true when count is between 90% and 100% of limit', () => {
      expect(shouldShowLimitWarning(90, 100)).toBe(true);
      expect(shouldShowLimitWarning(95, 100)).toBe(true);
    });
  
    test('returns false when count is below 90% of limit', () => {
      expect(shouldShowLimitWarning(89, 100)).toBe(false);
    });
  
    test('returns false when count equals or exceeds limit', () => {
      expect(shouldShowLimitWarning(100, 100)).toBe(false);
      expect(shouldShowLimitWarning(101, 100)).toBe(false);
    });
  });
  
  describe('shouldShowLimitError', () => {
    test('returns true when count equals or exceeds limit', () => {
      expect(shouldShowLimitError(100, 100)).toBe(true);
      expect(shouldShowLimitError(101, 100)).toBe(true);
    });
  
    test('returns false when count is below limit', () => {
      expect(shouldShowLimitError(99, 100)).toBe(false);
    });
  });
  
  describe('getMessageColor', () => {
    test('returns blue color for count below 90% of limit', () => {
      expect(getMessageColor(80, 100)).toBe('hsl(274, 90%, 80%)');
    });
  
    test('returns orange color for count between 90% and limit', () => {
      expect(getMessageColor(95, 100)).toBe('orange');
    });
  
    test('returns red color for count equal to or above limit', () => {
      expect(getMessageColor(100, 100)).toBe('red');
      expect(getMessageColor(110, 100)).toBe('red');
    });
  });