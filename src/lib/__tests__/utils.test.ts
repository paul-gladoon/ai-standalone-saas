/**
 * Unit tests for utility functions
 */

import {
  cn,
  formatDate,
  generateSlug,
  isValidHexColor,
  hexToRgb,
  truncateText,
  filterBySearch,
  sortByField,
  debounce,
} from '../utils'

describe('cn - Class name utility', () => {
  test('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  test('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class')
    expect(cn('base-class', false && 'conditional-class')).toBe('base-class')
  })

  test('should merge Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  test('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('', null, undefined)).toBe('')
  })
})

describe('formatDate', () => {
  test('should format valid date string correctly', () => {
    const result = formatDate('2024-01-15T10:30:00Z')
    expect(result).toMatch(/Jan 15, 2024/)
  })

  test('should handle custom format options', () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
    const result = formatDate('2024-01-15T10:30:00Z', options)
    expect(result).toMatch(/January 15, 2024/)
  })

  test('should return "Invalid date" for invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('Invalid date')
    expect(formatDate('')).toBe('Invalid date')
    expect(formatDate('not-a-date')).toBe('Invalid date')
  })

  test('should handle edge case dates', () => {
    expect(formatDate('2024-02-29T00:00:00Z')).toMatch(/Feb 29, 2024/) // Leap year
  })
})

describe('generateSlug', () => {
  test('should convert text to URL-friendly slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
    expect(generateSlug('Test Page Title')).toBe('test-page-title')
  })

  test('should handle special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world')
    expect(generateSlug('Test@#$%^&*()Page')).toBe('testpage')
  })

  test('should handle multiple spaces and underscores', () => {
    expect(generateSlug('Hello    World___Test')).toBe('hello-world-test')
    expect(generateSlug('  Multiple   Spaces  ')).toBe('multiple-spaces')
  })

  test('should remove leading and trailing hyphens', () => {
    expect(generateSlug('---Hello World---')).toBe('hello-world')
    expect(generateSlug('_Test_Page_')).toBe('test-page')
  })

  test('should handle empty and whitespace-only strings', () => {
    expect(generateSlug('')).toBe('')
    expect(generateSlug('   ')).toBe('')
  })
})

describe('isValidHexColor', () => {
  test('should validate 6-digit hex colors', () => {
    expect(isValidHexColor('#FF0000')).toBe(true)
    expect(isValidHexColor('#00ff00')).toBe(true)
    expect(isValidHexColor('#123ABC')).toBe(true)
  })

  test('should validate 3-digit hex colors', () => {
    expect(isValidHexColor('#F00')).toBe(true)
    expect(isValidHexColor('#0f0')).toBe(true)
    expect(isValidHexColor('#ABC')).toBe(true)
  })

  test('should reject invalid hex colors', () => {
    expect(isValidHexColor('FF0000')).toBe(false) // Missing #
    expect(isValidHexColor('#FF00')).toBe(false) // Wrong length
    expect(isValidHexColor('#GG0000')).toBe(false) // Invalid characters
    expect(isValidHexColor('')).toBe(false)
    expect(isValidHexColor('#')).toBe(false)
  })
})

describe('hexToRgb', () => {
  test('should convert 6-digit hex to RGB', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
  })

  test('should convert 3-digit hex to RGB', () => {
    expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#0F0')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#00F')).toEqual({ r: 0, g: 0, b: 255 })
  })

  test('should handle hex without # prefix', () => {
    expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('F00')).toEqual({ r: 255, g: 0, b: 0 })
  })

  test('should return null for invalid hex', () => {
    expect(hexToRgb('invalid')).toBeNull()
    expect(hexToRgb('')).toBeNull()
    expect(hexToRgb('#FF')).toBeNull()
    expect(hexToRgb('#GGGGGG')).toBeNull()
  })

  test('should handle lowercase hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('abc123')).toEqual({ r: 171, g: 193, b: 35 })
  })
})

describe('truncateText', () => {
  test('should truncate text longer than maxLength', () => {
    expect(truncateText('This is a long text', 10)).toBe('This is a...')
    expect(truncateText('Hello World', 5)).toBe('Hello...')
  })

  test('should return original text if shorter than maxLength', () => {
    expect(truncateText('Short', 10)).toBe('Short')
    expect(truncateText('Test', 4)).toBe('Test')
  })

  test('should handle edge cases', () => {
    expect(truncateText('', 5)).toBe('')
    expect(truncateText('Test', 0)).toBe('...')
    expect(truncateText('   Trimmed   ', 10)).toBe('Trimmed')
  })

  test('should trim whitespace before truncating', () => {
    expect(truncateText('  Hello World  ', 5)).toBe('Hello...')
  })
})

describe('filterBySearch', () => {
  const mockItems = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'user' },
  ]

  test('should filter items by search term', () => {
    const result = filterBySearch(mockItems, 'john', ['name', 'email'])
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('John Doe')
    expect(result[1].name).toBe('Bob Johnson')
  })

  test('should be case insensitive', () => {
    const result = filterBySearch(mockItems, 'JANE', ['name'])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Jane Smith')
  })

  test('should return all items for empty search term', () => {
    const result = filterBySearch(mockItems, '', ['name'])
    expect(result).toHaveLength(3)
  })

  test('should return all items for whitespace-only search term', () => {
    const result = filterBySearch(mockItems, '   ', ['name'])
    expect(result).toHaveLength(3)
  })

  test('should handle multiple search fields', () => {
    const result = filterBySearch(mockItems, 'test', ['name', 'email'])
    expect(result).toHaveLength(1)
    expect(result[0].email).toBe('bob@test.com')
  })

  test('should return empty array if no matches', () => {
    const result = filterBySearch(mockItems, 'nonexistent', ['name'])
    expect(result).toHaveLength(0)
  })
})

describe('sortByField', () => {
  const mockItems = [
    { id: 3, name: 'Charlie', age: 25 },
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 20 },
  ]

  test('should sort items in ascending order by default', () => {
    const result = sortByField(mockItems, 'name')
    expect(result[0].name).toBe('Alice')
    expect(result[1].name).toBe('Bob')
    expect(result[2].name).toBe('Charlie')
  })

  test('should sort items in descending order', () => {
    const result = sortByField(mockItems, 'name', 'desc')
    expect(result[0].name).toBe('Charlie')
    expect(result[1].name).toBe('Bob')
    expect(result[2].name).toBe('Alice')
  })

  test('should sort numeric fields correctly', () => {
    const result = sortByField(mockItems, 'age')
    expect(result[0].age).toBe(20)
    expect(result[1].age).toBe(25)
    expect(result[2].age).toBe(30)
  })

  test('should not mutate original array', () => {
    const original = [...mockItems]
    sortByField(mockItems, 'name')
    expect(mockItems).toEqual(original)
  })

  test('should handle equal values', () => {
    const items = [
      { name: 'Same', value: 1 },
      { name: 'Same', value: 2 },
    ]
    const result = sortByField(items, 'name')
    expect(result).toHaveLength(2)
  })
})

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('should delay function execution', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(60)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  test('should cancel previous calls when called again', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('first')
    jest.advanceTimersByTime(50)

    debouncedFn('second')
    jest.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('second')
  })

  test('should handle multiple arguments', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('arg1', 'arg2', 'arg3')
    jest.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })
})