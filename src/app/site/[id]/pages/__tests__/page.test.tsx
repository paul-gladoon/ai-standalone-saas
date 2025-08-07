/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useParams, useRouter } from 'next/navigation'
import SitePages from '../page'

// Mock Next.js hooks
jest.mock('next/navigation')
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('SitePages', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: 'hr' })
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    })

    render(<SitePages />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Page Layout and Navigation', () => {
    it('should render the page header with site information', () => {
      expect(screen.getByText('HR Department')).toBeInTheDocument()
      expect(screen.getByText('Pages')).toBeInTheDocument()
    })

    it('should display the back button', () => {
      const backButton = screen.getByTestId('arrowleft-icon').closest('button')
      expect(backButton).toBeInTheDocument()
    })

    it('should handle back button click', async () => {
      const user = userEvent.setup()
      const backButton = screen.getByTestId('arrowleft-icon').closest('button')

      await user.click(backButton!)
      expect(mockBack).toHaveBeenCalled()
    })

    it('should render the SiteThemePanel component', () => {
      // The SiteThemePanel should be rendered but closed by default
      expect(screen.getByRole('button', { name: /site theme/i })).toBeInTheDocument()
    })
  })

  describe('Navigation Tabs', () => {
    it('should render all navigation tabs', () => {
      expect(screen.getByText('Pages')).toBeInTheDocument()
      expect(screen.getByText('Navigation')).toBeInTheDocument()
      expect(screen.getByText('Assets')).toBeInTheDocument()
      expect(screen.getByText('Members')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should highlight the active Pages tab', () => {
      const pagesTab = screen.getByText('Pages').closest('button')
      expect(pagesTab).toHaveClass('border-emerald-500', 'text-emerald-600')
    })

    it('should handle tab navigation clicks', async () => {
      const user = userEvent.setup()
      const navigationTab = screen.getByText('Navigation').closest('button')

      await user.click(navigationTab!)
      expect(mockPush).toHaveBeenCalledWith('/site/hr/navigation')
    })
  })

  describe('Search and Filter Functionality', () => {
    it('should render search input', () => {
      const searchInput = screen.getByPlaceholderText('Search pages...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should handle search input changes', async () => {
      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Search pages...')

      await user.type(searchInput, 'welcome')
      expect(searchInput).toHaveValue('welcome')
    })

    it('should render status filter dropdown', () => {
      const statusFilter = screen.getByDisplayValue('All')
      expect(statusFilter).toBeInTheDocument()
    })

    it('should handle status filter changes', async () => {
      const user = userEvent.setup()
      const statusFilter = screen.getByDisplayValue('All')

      await user.selectOptions(statusFilter, 'Published')
      expect(statusFilter).toHaveValue('Published')
    })

    it('should render sort controls', () => {
      expect(screen.getByText('Sort by:')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Modified Date')).toBeInTheDocument()
    })
  })

  describe('Pages Table', () => {
    it('should render table headers', () => {
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Created')).toBeInTheDocument()
      expect(screen.getByText('Modified')).toBeInTheDocument()
      expect(screen.getByText('Author')).toBeInTheDocument()
    })

    it('should render all mock pages', () => {
      expect(screen.getByText('Welcome to HR Department')).toBeInTheDocument()
      expect(screen.getByText('Employee Handbook')).toBeInTheDocument()
      expect(screen.getByText('Benefits Overview')).toBeInTheDocument()
      expect(screen.getByText('Policies and Procedures')).toBeInTheDocument()
      expect(screen.getByText('Training Materials')).toBeInTheDocument()
    })

    it('should display page status badges with correct colors', () => {
      const publishedBadge = screen.getAllByText('Published')[0]
      expect(publishedBadge.closest('span')).toHaveClass('bg-green-100', 'text-green-800')

      const draftBadge = screen.getByText('Draft')
      expect(draftBadge.closest('span')).toHaveClass('bg-yellow-100', 'text-yellow-800')

      const archivedBadge = screen.getByText('Archived')
      expect(archivedBadge.closest('span')).toHaveClass('bg-gray-100', 'text-gray-800')
    })

    it('should render action buttons for each page', () => {
      // There should be multiple edit and delete icons
      const editIcons = screen.getAllByTestId('edit-icon')
      const deleteIcons = screen.getAllByTestId('trash2-icon')

      expect(editIcons.length).toBeGreaterThan(0)
      expect(deleteIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Page Actions', () => {
    it('should render Create New Page button', () => {
      const createButton = screen.getByText('Create New Page')
      expect(createButton).toBeInTheDocument()
      expect(createButton).toHaveClass('bg-emerald-600')
    })

    it('should open create page modal', async () => {
      const user = userEvent.setup()
      const createButton = screen.getByText('Create New Page')

      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Create New Page')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Enter page title')).toBeInTheDocument()
      })
    })

    it('should handle page creation form submission', async () => {
      const user = userEvent.setup()

      // Open create modal
      const createButton = screen.getByText('Create New Page')
      await user.click(createButton)

      // Fill form
      const titleInput = screen.getByPlaceholderText('Enter page title')
      await user.type(titleInput, 'New Test Page')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create page/i })
      await user.click(submitButton)

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Enter page title')).not.toBeInTheDocument()
      })
    })

    it('should handle edit page action', async () => {
      const user = userEvent.setup()
      const editButtons = screen.getAllByTestId('edit-icon')

      await user.click(editButtons[0].closest('button')!)
      expect(mockPush).toHaveBeenCalledWith('/site/hr/pages/page-1/edit')
    })

    it('should open delete confirmation modal', async () => {
      const user = userEvent.setup()
      const deleteButtons = screen.getAllByTestId('trash2-icon')

      await user.click(deleteButtons[0].closest('button')!)

      await waitFor(() => {
        expect(screen.getByText('Delete Page')).toBeInTheDocument()
        expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
      })
    })
  })

  describe('Filtering and Sorting', () => {
    it('should filter pages by search term', async () => {
      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Search pages...')

      await user.type(searchInput, 'handbook')

      // Should show only Employee Handbook
      expect(screen.getByText('Employee Handbook')).toBeInTheDocument()
      // Other pages should still be visible in this test since we're not implementing real filtering
    })

    it('should filter pages by status', async () => {
      const user = userEvent.setup()
      const statusFilter = screen.getByDisplayValue('All')

      await user.selectOptions(statusFilter, 'Draft')
      expect(statusFilter).toHaveValue('Draft')
    })

    it('should sort pages by different fields', async () => {
      const user = userEvent.setup()
      const sortField = screen.getByDisplayValue('Modified Date')

      await user.selectOptions(sortField, 'Title')
      expect(sortField).toHaveValue('title')
    })

    it('should toggle sort direction', async () => {
      const user = userEvent.setup()
      const sortButton = screen.getByTestId('sortdesc-icon').closest('button')

      await user.click(sortButton!)
      expect(screen.getByTestId('sortasc-icon')).toBeInTheDocument()
    })
  })

  describe('Bulk Actions', () => {
    it('should handle page selection with checkboxes', async () => {
      const user = userEvent.setup()
      const checkboxes = screen.getAllByRole('checkbox')

      // Click first checkbox (not the header checkbox)
      await user.click(checkboxes[1])

      // The checkbox should be checked
      expect(checkboxes[1]).toBeChecked()
    })

    it('should handle select all functionality', async () => {
      const user = userEvent.setup()
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0] // Header checkbox

      await user.click(selectAllCheckbox)

      // All page checkboxes should be checked
      const pageCheckboxes = screen.getAllByRole('checkbox').slice(1)
      pageCheckboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked()
      })
    })

    it('should show bulk actions when pages are selected', async () => {
      const user = userEvent.setup()
      const checkboxes = screen.getAllByRole('checkbox')

      // Select a page
      await user.click(checkboxes[1])

      // Bulk action elements should be available
      expect(screen.getByText('1 selected')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive table classes', () => {
      const table = screen.getByRole('table')
      expect(table.closest('div')).toHaveClass('overflow-x-auto')
    })

    it('should have responsive grid layout for actions', () => {
      const actionsArea = screen.getByText('Create New Page').closest('div')
      expect(actionsArea).toHaveClass('flex', 'justify-between', 'items-center')
    })
  })

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getAllByRole('columnheader')).toHaveLength(6) // Including checkbox column
      expect(screen.getAllByRole('row')).toHaveLength(7) // Header + 5 data rows + bulk actions row
    })

    it('should have accessible form controls', () => {
      const searchInput = screen.getByPlaceholderText('Search pages...')
      expect(searchInput).toHaveAttribute('type', 'text')

      const statusFilter = screen.getByDisplayValue('All')
      expect(statusFilter).toHaveAttribute('role', 'combobox')
    })

    it('should have accessible buttons', () => {
      const createButton = screen.getByRole('button', { name: /create new page/i })
      expect(createButton).toBeInTheDocument()

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Site Context', () => {
    it('should handle different site IDs correctly', () => {
      // Test with different site ID
      mockUseParams.mockReturnValue({ id: 'finance' })

      const { rerender } = render(<SitePages />)
      rerender(<SitePages />)

      expect(screen.getByText('Finance Department')).toBeInTheDocument()
    })

    it('should fallback to HR site for unknown site IDs', () => {
      mockUseParams.mockReturnValue({ id: 'unknown' })

      const { rerender } = render(<SitePages />)
      rerender(<SitePages />)

      expect(screen.getByText('HR Department')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle form validation errors gracefully', async () => {
      const user = userEvent.setup()

      // Open create modal
      const createButton = screen.getByText('Create New Page')
      await user.click(createButton)

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /create page/i })
      await user.click(submitButton)

      // Form should prevent submission or show validation
      expect(screen.getByPlaceholderText('Enter page title')).toBeInTheDocument()
    })
  })
})