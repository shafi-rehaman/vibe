# Test Suite

This directory contains the testing infrastructure for the Vibe project.

## Structure

- `setup.ts` - Global test setup and mocks
- `test-utils.tsx` - Custom render functions with providers
- `mocks/` - Mock implementations for external dependencies

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

All test files should be colocated with the source files they test, using the `.test.ts` or `.test.tsx` extension.

Example: