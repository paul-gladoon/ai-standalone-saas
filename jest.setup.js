import '@testing-library/jest-dom'

// Add missing globals for Node 16 compatibility
global.fetch = global.fetch || jest.fn()
global.Request = global.Request || class Request {}
global.Response = global.Response || class Response {}
global.Headers = global.Headers || class Headers {}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'hr' })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Building2: () => <svg data-testid="building2-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  FileText: () => <svg data-testid="filetext-icon" />,
  HelpCircle: () => <svg data-testid="helpcircle-icon" />,
  Plus: () => <svg data-testid="plus-icon" />,
  Search: () => <svg data-testid="search-icon" />,
  ChevronDown: () => <svg data-testid="chevrondown-icon" />,
  Palette: () => <svg data-testid="palette-icon" />,
  X: () => <svg data-testid="x-icon" />,
  Type: () => <svg data-testid="type-icon" />,
  Square: () => <svg data-testid="square-icon" />,
  Layers: () => <svg data-testid="layers-icon" />,
  Monitor: () => <svg data-testid="monitor-icon" />,
  Layout: () => <svg data-testid="layout-icon" />,
  Code: () => <svg data-testid="code-icon" />,
  RotateCcw: () => <svg data-testid="rotateccw-icon" />,
  Save: () => <svg data-testid="save-icon" />,
  Eye: () => <svg data-testid="eye-icon" />,
  Navigation: () => <svg data-testid="navigation-icon" />,
  Image: () => <svg data-testid="image-icon" />,
  Users: () => <svg data-testid="users-icon" />,
  ArrowLeft: () => <svg data-testid="arrowleft-icon" />,
  MoreHorizontal: () => <svg data-testid="morehorizontal-icon" />,
  Edit: () => <svg data-testid="edit-icon" />,
  Trash2: () => <svg data-testid="trash2-icon" />,
  Copy: () => <svg data-testid="copy-icon" />,
  Filter: () => <svg data-testid="filter-icon" />,
  SortAsc: () => <svg data-testid="sortasc-icon" />,
  SortDesc: () => <svg data-testid="sortdesc-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})