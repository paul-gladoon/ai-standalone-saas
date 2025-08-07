/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TenantDashboard from '../page'

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('TenantDashboard', () => {
  beforeEach(() => {
    render(<TenantDashboard />)
  })

  describe('Layout and Navigation', () => {
    it('should render the main layout structure', () => {
      // Check for main layout elements
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should display the ShortPoint logo', () => {
      const logo = screen.getByAltText('ShortPoint')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/shortpoint-logo.svg')
    })

    it('should render sidebar navigation items', () => {
      expect(screen.getByText('Sites')).toBeInTheDocument()
      expect(screen.getByText('Licensing')).toBeInTheDocument()
      expect(screen.getByText('Tenant Settings')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })

    it('should highlight Sites as active navigation item', () => {
      const sitesLink = screen.getByText('Sites').closest('a')
      expect(sitesLink).toHaveClass('text-[#3161D1]', 'bg-[#E7F5FF]')
    })

    it('should have proper hover states for navigation items', () => {
      const licensingLink = screen.getByText('Licensing').closest('a')
      expect(licensingLink).toHaveClass('hover:text-[#3161D1]', 'hover:bg-[#E7F5FF]')
    })
  })

  describe('Header Section', () => {
    it('should display the page title', () => {
      expect(screen.getByText('My Sites')).toBeInTheDocument()
    })

    it('should render search functionality', () => {
      const searchInput = screen.getByPlaceholderText('Search sites...')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveClass('focus:ring-2', 'focus:ring-[#3161D1]')
    })

    it('should display user profile section', () => {
      expect(screen.getByText('Admin User')).toBeInTheDocument()

      // Check for user avatar
      const avatar = screen.getByText('A')
      expect(avatar).toBeInTheDocument()
      expect(avatar.closest('div')).toHaveClass('bg-[#3161D1]')
    })

    it('should have functional search input', async () => {
      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Search sites...')

      await user.type(searchInput, 'test search')
      expect(searchInput).toHaveValue('test search')
    })
  })

  describe('Site Cards Grid', () => {
    it('should render all mock sites', () => {
      // Check for all expected site names
      expect(screen.getByText('Human Resources')).toBeInTheDocument()
      expect(screen.getByText('Finance Department')).toBeInTheDocument()
      expect(screen.getByText('Information Technology')).toBeInTheDocument()
      expect(screen.getByText('Development Team')).toBeInTheDocument()
      expect(screen.getByText('Marketing Team')).toBeInTheDocument()
    })

    it('should display site URLs correctly', () => {
      expect(screen.getByText('hr.company.com')).toBeInTheDocument()
      expect(screen.getByText('finance.company.com')).toBeInTheDocument()
      expect(screen.getByText('it.company.com')).toBeInTheDocument()
      expect(screen.getByText('dev.company.com')).toBeInTheDocument()
      expect(screen.getByText('marketing.company.com')).toBeInTheDocument()
    })

    it('should render site cards with correct department colors', () => {
      const hrCard = screen.getByText('HR').closest('div')
      expect(hrCard).toHaveStyle('background-color: #FF6B6B')

      const financeCard = screen.getByText('Finance').closest('div')
      expect(financeCard).toHaveStyle('background-color: #4ECDC4')

      const itCard = screen.getByText('IT').closest('div')
      expect(itCard).toHaveStyle('background-color: #45B7D1')
    })

    it('should have proper grid layout classes', () => {
      const grid = screen.getByText('Human Resources').closest('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
    })

    it('should have hover effects on site cards', () => {
      const firstCard = screen.getByText('Human Resources').closest('div')
      expect(firstCard).toHaveClass('hover:shadow-lg', 'transition-all')
    })
  })

  describe('Create New Site Button', () => {
    it('should render create new site button', () => {
      const createButton = screen.getByText('Create New Site')
      expect(createButton).toBeInTheDocument()
      expect(createButton).toHaveClass('bg-[#3161D1]', 'text-white')
    })

    it('should have proper styling and hover effects', () => {
      const createButton = screen.getByText('Create New Site')
      expect(createButton).toHaveClass('hover:bg-[#2a56c7]', 'focus:ring-2', 'focus:ring-[#3161D1]')
    })

    it('should display plus icon', () => {
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should be clickable', async () => {
      const user = userEvent.setup()
      const createButton = screen.getByText('Create New Site')

      await user.click(createButton)
      // Since we're in prototyping mode, this would typically trigger some action
      expect(createButton).toBeInTheDocument()
    })
  })

  describe('Site Navigation Links', () => {
    it('should have correct href attributes for site links', () => {
      const hrLink = screen.getByText('Human Resources').closest('a')
      expect(hrLink).toHaveAttribute('href', '/site/1')

      const financeLink = screen.getByText('Finance Department').closest('a')
      expect(financeLink).toHaveAttribute('href', '/site/2')

      const itLink = screen.getByText('Information Technology').closest('a')
      expect(itLink).toHaveAttribute('href', '/site/3')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()

      // Tab through the page to reach site links
      await user.tab() // Search input
      await user.tab() // Create button
      await user.tab() // First site link

      const hrLink = screen.getByText('Human Resources').closest('a')
      expect(hrLink).toHaveFocus()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes for different screen sizes', () => {
      // Check sidebar has fixed width
      const sidebar = screen.getByRole('navigation').closest('div')
      expect(sidebar).toHaveClass('w-[230px]')

      // Check main content is flexible
      const mainContent = screen.getByRole('main').closest('div')
      expect(mainContent).toHaveClass('flex-1')
    })

    it('should have responsive grid for site cards', () => {
      const grid = screen.getByText('Human Resources').closest('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should have accessible form elements', () => {
      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toHaveAttribute('placeholder', 'Search sites...')
    })

    it('should have proper button roles', () => {
      const createButton = screen.getByRole('button', { name: /create new site/i })
      expect(createButton).toBeInTheDocument()
    })

    it('should have accessible navigation links', () => {
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      // Check that site links are accessible
      const hrLink = screen.getByRole('link', { name: /human resources/i })
      expect(hrLink).toBeInTheDocument()
    })
  })

  describe('Color Theme Consistency', () => {
    it('should use consistent brand colors', () => {
      // Check primary blue color usage
      const activeNavItem = screen.getByText('Sites').closest('a')
      expect(activeNavItem).toHaveClass('text-[#3161D1]')

      const createButton = screen.getByText('Create New Site')
      expect(createButton).toHaveClass('bg-[#3161D1]')

      const userAvatar = screen.getByText('A').closest('div')
      expect(userAvatar).toHaveClass('bg-[#3161D1]')
    })

    it('should use consistent background colors', () => {
      const mainBackground = screen.getByText('My Sites').closest('div')?.parentElement
      expect(mainBackground).toHaveClass('bg-[#f5f6fa]')
    })
  })

  describe('Interactive Elements', () => {
    it('should handle user interactions properly', async () => {
      const user = userEvent.setup()

      // Test search input interaction
      const searchInput = screen.getByPlaceholderText('Search sites...')
      await user.type(searchInput, 'HR')
      expect(searchInput).toHaveValue('HR')

      // Test button interaction
      const createButton = screen.getByText('Create New Site')
      await user.click(createButton)
      expect(createButton).toBeInTheDocument()
    })

    it('should maintain focus states properly', async () => {
      const user = userEvent.setup()

      const searchInput = screen.getByPlaceholderText('Search sites...')
      await user.click(searchInput)
      expect(searchInput).toHaveFocus()
    })
  })
})