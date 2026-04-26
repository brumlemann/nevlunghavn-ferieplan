# Claude Test Writing Guidelines

## Test Writing Guidelines

### Technology Stack
- Vitest for unit and integration tests
- Use @testing-library/react for React component tests

### Testing Philosophy
- Test component BEHAVIOR, not implementation details
- Test how users interact with components (clicks, typing, visual feedback)
- Avoid testing internal state, private methods, or component structure
- **Don't over-test**: 100% test coverage is NOT the goal
- Focus on testing LOGIC in realistic scenarios, not every possible code path
- Each test has a maintenance cost - only write tests that provide real value

### Mocking Strategy
- Mock server actions at the module level with vi.mock
- Mock at the boundary (actions), not internals (domain functions)
- Domain functions in src/domain/ are pure — test them directly
  with real inputs, no mocking needed
- Database layer is the mock boundary for action-level integration
  tests if needed

#### What NOT to Test
- **Prop passing**: Don't verify props are passed to child components (TypeScript does this)
- **Component rendering**: Don't just check if a component mounts
- **Implementation details**: Don't test internal functions, state, or component structure
- **Third-party libraries**: Don't test that Tailwind or React work correctly
- **Trivial logic**: Don't test simple assignments or obvious behavior

#### What TO Test
- **User workflows**: Complete user journeys from interaction to result
- **Business logic**: Validation, calculations, data transformations
- **Error handling**: How the app behaves when things go wrong
- **Integration points**: server action calls, form submissions, data flow between components
- **Conditional rendering**: When components show/hide based on meaningful conditions (permissions, state, etc.)
