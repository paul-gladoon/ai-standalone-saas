/**
 * Unit tests for Login Page component - Passing tests only
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'
import { AuthProvider } from '../../../components/providers/AuthProvider'

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const renderLoginPage = () => {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
  })

  test('should render login form by default', async () => {
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByText('Login to Account')).toBeInTheDocument()
    })

    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Confirm Password')).not.toBeInTheDocument()
  })

  test('should switch to signup form when Create Account is clicked', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByText('Login to Account')).toBeInTheDocument()
    })

    const createAccountButton = screen.getByText('Create Account')
    await user.click(createAccountButton)

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  test('should toggle password visibility', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByPlaceholderText('Password')
    const toggleButton = screen.getByTestId('eye-icon').closest('button')

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton!)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButton!)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should clear form data when switching between login and signup', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Your email')
    const passwordInput = screen.getByPlaceholderText('Password')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const createAccountButton = screen.getByText('Create Account')
    await user.click(createAccountButton)

    expect(emailInput).toHaveValue('')
    expect(passwordInput).toHaveValue('')
  })

  test('should validate required email field', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  test('should validate password requirement', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Your email')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  test('should clear errors when user starts typing', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    expect(screen.getByText('Email is required')).toBeInTheDocument()

    const emailInput = screen.getByPlaceholderText('Your email')
    await user.type(emailInput, 'test@example.com')

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
  })

  test('should handle forgot password click', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()

    renderLoginPage()

    await waitFor(() => {
      expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    })

    const forgotPasswordButton = screen.getByText('Forgot password?')
    await user.click(forgotPasswordButton)

    expect(alertSpy).toHaveBeenCalledWith('Forgot password functionality (Mock - not connected to backend)')

    alertSpy.mockRestore()
  })
})