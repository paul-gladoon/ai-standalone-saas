// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({
    id: 'test-site-id',
    pageId: 'test-page-id'
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('test-value'),
  }),
  usePathname: () => '/test-path',
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  // Common icons used in the app
  Building2: () => <div data-testid="building2-icon">Building2</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  HelpCircle: () => <div data-testid="helpcircle-icon">HelpCircle</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  LogOut: () => <div data-testid="logout-icon">LogOut</div>,
  Palette: () => <div data-testid="palette-icon">Palette</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Type: () => <div data-testid="type-icon">Type</div>,
  Square: () => <div data-testid="square-icon">Square</div>,
  Layers: () => <div data-testid="layers-icon">Layers</div>,
  Monitor: () => <div data-testid="monitor-icon">Monitor</div>,
  Layout: () => <div data-testid="layout-icon">Layout</div>,
  Code: () => <div data-testid="code-icon">Code</div>,
  RotateCcw: () => <div data-testid="rotateccw-icon">RotateCcw</div>,
  Save: () => <div data-testid="save-icon">Save</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eyeoff-icon">EyeOff</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  ChevronRight: () => <div data-testid="chevronright-icon">ChevronRight</div>,
  MoreVertical: () => <div data-testid="morevertical-icon">MoreVertical</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Trash2: () => <div data-testid="trash2-icon">Trash2</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  ExternalLink: () => <div data-testid="externallink-icon">ExternalLink</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  SortAsc: () => <div data-testid="sortasc-icon">SortAsc</div>,
  SortDesc: () => <div data-testid="sortdesc-icon">SortDesc</div>,
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock window.dispatchEvent for theme updates
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
})

// Setup DOM environment for browser APIs
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/test-path',
    href: 'http://localhost:3000/test-path',
    origin: 'http://localhost:3000',
  },
  writable: true,
})

// Mock requestAnimationFrame for theme animations
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0))

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})