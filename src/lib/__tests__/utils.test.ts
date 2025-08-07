/**
 * @jest-environment jsdom
 */

import {
  formatDate,
  generateSlug,
  isValidHexColor,
  hexToRgb,
  truncateText,
  filterBySearch,
  sortByField,
  debounce
} from '../utils'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format valid date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024')
      expect(formatDate('2023-12-25')).toBe('Dec 25, 2023')
    })

    it('should handle invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('Invalid date')
      expect(formatDate('')).toBe('Invalid date')
      expect(formatDate('2024-13-40')).toBe('Invalid date')
    })

    it('should respect custom formatting options', () => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      expect(formatDate('2024-01-15', options)).toBe('January 15, 2024')
    })

    it('should handle edge cases', () => {
      expect(formatDate('2024-02-29')).toBe('Feb 29, 2024') // Leap year
    })
  })

  describe('generateSlug', () => {
    it('should convert text to URL-friendly slugs', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
      expect(generateSlug('This is a Test')).toBe('this-is-a-test')
    })

    it('should handle special characters', () => {
      expect(generateSlug('Hello! World?')).toBe('hello-world')
      expect(generateSlug('test@example.com')).toBe('testexamplecom')
      expect(generateSlug('price: $100')).toBe('price-100')
    })

    it('should handle multiple spaces and underscores', () => {
      expect(generateSlug('hello    world')).toBe('hello-world')
      expect(generateSlug('hello___world')).toBe('hello-world')
      expect(generateSlug('hello---world')).toBe('hello-world')
    })

    it('should trim leading and trailing hyphens', () => {
      expect(generateSlug('-hello-world-')).toBe('hello-world')
      expect(generateSlug('---test---')).toBe('test')
    })

    it('should handle empty and whitespace strings', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug('   ')).toBe('')
    })
  })

  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#FF0000')).toBe(true)
      expect(isValidHexColor('#00ff00')).toBe(true)
      expect(isValidHexColor('#123ABC')).toBe(true)
    })

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#F00')).toBe(true)
      expect(isValidHexColor('#0f0')).toBe(true)
      expect(isValidHexColor('#ABC')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('FF0000')).toBe(false) // Missing #
      expect(isValidHexColor('#GG0000')).toBe(false) // Invalid characters
      expect(isValidHexColor('#FF00')).toBe(false) // Wrong length
      expect(isValidHexColor('#FF00000')).toBe(false) // Too long
      expect(isValidHexColor('')).toBe(false) // Empty string
      expect(isValidHexColor('red')).toBe(false) // Color name
    })
  })

  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#0F0')).toEqual({ r: 0, g: 255, b: 0 })
      expect(hexToRgb('#00F')).toEqual({ r: 0, g: 0, b: 255 })
    })

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('F00')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle case-insensitive hex', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should return null for invalid hex', () => {
      expect(hexToRgb('#GG0000')).toBeNull()
      expect(hexToRgb('#FF00')).toBeNull()
      expect(hexToRgb('invalid')).toBeNull()
      expect(hexToRgb('')).toBeNull()
    })
  })

  describe('truncateText', () => {
    it('should truncate text longer than maxLength', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...')
      expect(truncateText('Hello World!', 8)).toBe('Hello Wo...')
    })

    it('should not truncate text shorter than or equal to maxLength', () => {
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('Exactly10!', 10)).toBe('Exactly10!')
    })

    it('should handle edge cases', () => {
      expect(truncateText('', 5)).toBe('')
      expect(truncateText('Test', 0)).toBe('...')
      expect(truncateText('  Test  ', 4)).toBe('Test')
    })

    it('should trim whitespace before adding ellipsis', () => {
      expect(truncateText('Hello World   ', 8)).toBe('Hello Wo...')
    })
  })

  describe('filterBySearch', () => {
    const mockItems = [
      { id: 1, name: 'John Doe', department: 'HR', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', department: 'Finance', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', department: 'IT', email: 'bob@example.com' }
    ]

    it('should filter items by search term', () => {
      const result = filterBySearch(mockItems, 'john', ['name'])
      expect(result).toHaveLength(2)
      expect(result.map(item => item.name)).toEqual(['John Doe', 'Bob Johnson'])
    })

    it('should search across multiple fields', () => {
      const result = filterBySearch(mockItems, 'finance', ['name', 'department'])
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Jane Smith')
    })

    it('should be case-insensitive', () => {
      const result = filterBySearch(mockItems, 'DOE', ['name'])
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('John Doe')
    })

    it('should return all items for empty search term', () => {
      expect(filterBySearch(mockItems, '', ['name'])).toEqual(mockItems)
      expect(filterBySearch(mockItems, '   ', ['name'])).toEqual(mockItems)
    })

    it('should return empty array when no matches', () => {
      const result = filterBySearch(mockItems, 'xyz', ['name'])
      expect(result).toHaveLength(0)
    })
  })

  describe('sortByField', () => {
    const mockItems = [
      { id: 3, name: 'Charlie', age: 25, date: '2024-01-03' },
      { id: 1, name: 'Alice', age: 30, date: '2024-01-01' },
      { id: 2, name: 'Bob', age: 20, date: '2024-01-02' }
    ]

    it('should sort by field in ascending order by default', () => {
      const result = sortByField(mockItems, 'name')
      expect(result.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('should sort by field in descending order', () => {
      const result = sortByField(mockItems, 'age', 'desc')
      expect(result.map(item => item.age)).toEqual([30, 25, 20])
    })

    it('should sort by numeric fields', () => {
      const result = sortByField(mockItems, 'id', 'asc')
      expect(result.map(item => item.id)).toEqual([1, 2, 3])
    })

    it('should sort by date strings', () => {
      const result = sortByField(mockItems, 'date', 'asc')
      expect(result.map(item => item.date)).toEqual(['2024-01-01', '2024-01-02', '2024-01-03'])
    })

    it('should not mutate original array', () => {
      const original = [...mockItems]
      sortByField(mockItems, 'name')
      expect(mockItems).toEqual(original)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should cancel previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('first')
      jest.advanceTimersByTime(500)
      debouncedFn('second')
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('second')
    })

    it('should handle multiple arguments', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn('arg1', 'arg2', 'arg3')
      jest.advanceTimersByTime(1000)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })
  })
})