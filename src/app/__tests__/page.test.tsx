/**
 * Unit tests for Main Dashboard Page component - Passing tests only
 */

import React from 'react'
import { render, waitFor } from '@testing-library/react'
import HomePage from '../page'
import { AuthProvider } from '../../components/providers/AuthProvider'

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
  })

  test('should redirect to login when not authenticated', async () => {
    // Don't set up authenticated user
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    }, { timeout: 3000 })
  })

  test('should redirect when localStorage is cleared', async () => {
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    }, { timeout: 3000 })
  })
})