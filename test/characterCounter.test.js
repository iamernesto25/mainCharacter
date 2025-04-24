import {
    calculateCharCount,
    countWords,
    countSentences
  } from '../js/pureFunctions.js';
  
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
  
    test('counts special characters correctly', () => {
      expect(calculateCharCount('héllø!', false)).toBe(6);
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
  
    test('handles punctuation within words', () => {
      expect(countWords("Don't stop believing").length).toBe(3);
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