# 🧪 Testing Documentation

Welcome to the ShortPoint Standalone testing documentation! This guide will help you understand, run, and extend the testing infrastructure.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx jest src/lib/__tests__/utils.test.ts
```

## 📚 Documentation Structure

- **[Testing Guide](./testing-guide.md)** - Complete guide to writing and running tests
- **[Test Patterns](./test-patterns.md)** - Common testing patterns and best practices
- **[Component Testing](./component-testing.md)** - Specific guide for testing React components
- **[Utility Testing](./utility-testing.md)** - Guide for testing utility functions
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## 🎯 Current Test Status

### ✅ Fully Tested & Working
- **Utility Functions** - 34/34 tests passing
- **Testing Infrastructure** - Complete setup working

### 🚧 Component Tests Created (Fine-tuning needed)
- **SiteThemePanel** - Theme customization component
- **TenantDashboard** - Main dashboard page
- **SitePages** - Pages management interface

## 🧰 Tech Stack

- **[Jest](https://jestjs.io/)** - Test runner and assertion library
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[Jest DOM](https://github.com/testing-library/jest-dom)** - Custom Jest matchers for DOM
- **[User Event](https://testing-library.com/docs/user-event/intro/)** - User interaction simulation

## 📂 Test File Structure

```
src/
├── lib/
│   ├── utils.ts                    # ✅ Utility functions
│   └── __tests__/
│       └── utils.test.ts           # ✅ 34 passing tests
├── components/
│   ├── SiteThemePanel.tsx
│   └── __tests__/
│       └── SiteThemePanel.test.tsx # 🚧 Component tests
├── app/
│   ├── page.tsx
│   ├── __tests__/
│   │   └── page.test.tsx           # 🚧 Dashboard tests
│   └── site/[id]/pages/
│       ├── page.tsx
│       └── __tests__/
│           └── page.test.tsx       # 🚧 Pages tests
└── ...
```

## 🚀 Getting Started

1. **Run the existing tests** to ensure everything works:
   ```bash
   npm test
   ```

2. **Start development with watch mode**:
   ```bash
   npm run test:watch
   ```

3. **Read the [Testing Guide](./testing-guide.md)** for detailed instructions

4. **Check [Test Patterns](./test-patterns.md)** for examples and best practices

## 📊 Coverage Goals

- **Utility Functions**: 100% (✅ Achieved)
- **Components**: 80% coverage target
- **Critical User Flows**: 100% coverage
- **Edge Cases**: Comprehensive coverage

## 🎯 Testing Philosophy

Our testing approach focuses on:

1. **User-Centric Testing** - Test what users actually do
2. **Accessibility First** - Ensure components work for everyone
3. **Real Scenarios** - Test with realistic data and interactions
4. **Maintainable Tests** - Write tests that are easy to understand and update
5. **Fast Feedback** - Tests should run quickly for rapid development

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure accessibility compliance
3. Test both happy path and edge cases
4. Update documentation if needed
5. Run full test suite before committing

## 📞 Support

- Check [Troubleshooting](./troubleshooting.md) for common issues
- Review existing test examples for patterns
- Ask team members for help with complex scenarios

---

Happy Testing! 🧪✨