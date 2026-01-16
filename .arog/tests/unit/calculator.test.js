const { add, subtract, multiply, divide } = require('../../src/utils/calculator');

describe('Calculator Utilities', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('should add mixed positive and negative', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => add('2', 3)).toThrow('Both arguments must be numbers');
    });
  });

  describe('subtract', () => {
    test('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => subtract(5, '3')).toThrow('Both arguments must be numbers');
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(multiply(-3, -4)).toBe(12);
    });

    test('should throw error for non-number inputs', () => {
      expect(() => multiply(3, null)).toThrow('Both arguments must be numbers');
    });
  });

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(divide(10, 3)).toBeCloseTo(3.33, 2);
    });

    test('should throw error for division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });

    test('should throw error for non-number inputs', () => {
      expect(() => divide(10, undefined)).toThrow('Both arguments must be numbers');
    });
  });
});
