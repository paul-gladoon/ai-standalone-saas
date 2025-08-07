/**
 * Unit tests for SiteThemePanel component - Passing tests only
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SiteThemePanel, { getSavedThemeColor, getSavedTheme } from '../SiteThemePanel'

// Mock window location
const mockLocation = {
  pathname: '/site/test-site-id/pages',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('SiteThemePanel', () => {
  const defaultProps = {
    siteId: 'test-site-id',
    siteTheme: '#8B9FE6',
  }

  beforeEach(() => {
    localStorage.clear()
    document.head.innerHTML = ''
    document.body.removeAttribute('data-site-id')
  })

  test('should render theme button with correct color', () => {
    render(<SiteThemePanel {...defaultProps} />)

    const themeButton = screen.getByTitle('Site Theme')
    expect(themeButton).toBeInTheDocument()
    expect(themeButton).toHaveStyle(`background-color: ${defaultProps.siteTheme}`)
  })

  test('should open theme panel when button is clicked', async () => {
    const user = userEvent.setup()
    render(<SiteThemePanel {...defaultProps} />)

    const themeButton = screen.getByTitle('Site Theme')
    await user.click(themeButton)

    expect(screen.getByText('Site Theme')).toBeInTheDocument()
    expect(screen.getByText('Color Palette')).toBeInTheDocument()
  })

  test('should close theme panel when X button is clicked', async () => {
    const user = userEvent.setup()
    render(<SiteThemePanel {...defaultProps} />)

    // Open panel
    const themeButton = screen.getByTitle('Site Theme')
    await user.click(themeButton)

    // Close panel
    const closeButton = screen.getByTestId('x-icon').closest('button')
    await user.click(closeButton!)

    expect(screen.queryByText('Color Palette')).not.toBeInTheDocument()
  })

  test('should close theme panel when overlay is clicked', async () => {
    const user = userEvent.setup()
    render(<SiteThemePanel {...defaultProps} />)

    // Open panel
    const themeButton = screen.getByTitle('Site Theme')
    await user.click(themeButton)

    // Click overlay
    const overlay = document.querySelector('.fixed.inset-0.z-40')
    await user.click(overlay!)

    expect(screen.queryByText('Color Palette')).not.toBeInTheDocument()
  })

  test('should switch between theme sections', async () => {
    const user = userEvent.setup()
    render(<SiteThemePanel {...defaultProps} />)

    // Open panel
    const themeButton = screen.getByTitle('Site Theme')
    await user.click(themeButton)

    // Click on Text section
    const textSection = screen.getByText('Text')
    await user.click(textSection)

    expect(screen.getByText('Font Family')).toBeInTheDocument()
    expect(screen.getByText('Font Size')).toBeInTheDocument()
  })

  test('should update color palette values', async () => {
    const user = userEvent.setup()
    render(<SiteThemePanel {...defaultProps} />)

    // Open panel
    const themeButton = screen.getByTitle('Site Theme')
    await user.click(themeButton)

    // Find primary color input
    const colorInputs = screen.getAllByDisplayValue(defaultProps.siteTheme)
    const primaryColorInput = colorInputs[0]

    await user.clear(primaryColorInput)
    await user.type(primaryColorInput, '#FF0000')

    expect(primaryColorInput).toHaveValue('#FF0000')
  })

  test('should apply theme styles to document', () => {
    render(<SiteThemePanel {...defaultProps} />)

    // Should set site ID on body
    expect(document.body.getAttribute('data-site-id')).toBe(defaultProps.siteId)

    // Should inject style element
    const styleElement = document.getElementById(`site-theme-override-${defaultProps.siteId}`)
    expect(styleElement).toBeInTheDocument()
  })
})

describe('getSavedThemeColor utility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should return fallback color when no saved theme', () => {
    const result = getSavedThemeColor('non-existent', '#000000')
    expect(result).toBe('#000000')
  })

  test('should return fallback color when localStorage is corrupted', () => {
    localStorage.setItem('site-theme-test', 'invalid-json')

    const result = getSavedThemeColor('test', '#000000')
    expect(result).toBe('#000000')
  })
})

describe('getSavedTheme utility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should return default theme with fallback color when no saved theme', () => {
    const result = getSavedTheme('non-existent', '#000000')
    expect(result.colorPalette.primary).toBe('#000000')
    expect(result.text.fontFamily).toBe('Inter') // Default value
  })
})