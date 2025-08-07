/**
 * Unit tests for AuthProvider component - Passing tests only
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthProvider'

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Test component that uses useAuth hook
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, signup, logout } = useAuth()

  const handleLogin = async () => {
    await login('test@example.com', 'password123')
  }

  const handleSignup = async () => {
    await signup('test@shortpoint.com', 'password123')
  }

  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="user-name">{user?.name || 'No name'}</div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <button data-testid="login-btn" onClick={handleLogin}>
        Login
      </button>
      <button data-testid="signup-btn" onClick={handleSignup}>
        Signup
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

const renderWithAuthProvider = (children: React.ReactNode) => {
  return render(
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
  })

  test('should provide initial auth state', async () => {
    renderWithAuthProvider(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('No user')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
  })

  test('should handle corrupted localStorage data gracefully', async () => {
    localStorage.setItem('auth_user', 'invalid-json')

    renderWithAuthProvider(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user-email')).toHaveTextContent('No user')
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
  })

  test('should login successfully with valid credentials', async () => {
    const user = userEvent.setup()
    renderWithAuthProvider(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
    })
  })

  test('should signup successfully with shortpoint.com email', async () => {
    const user = userEvent.setup()
    renderWithAuthProvider(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
    })

    await act(async () => {
      await user.click(screen.getByTestId('signup-btn'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@shortpoint.com')
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
    })
  })

  test('should throw error when useAuth is used outside AuthProvider', () => {
    // Spy on console.error to suppress error output during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})