# Technology Stack

## Architecture

This project uses a standard Single Page Application (SPA) built with Create React App and organized around short, self-contained mini-game components. The gameplay loop is intentionally simple: states, timing windows, retry logic, and visual feedback live within a component rather than a full backend.

## Core Technologies

- **Language**: JavaScript (ES6+)
- **Framework**: React 19.3
- **Runtime**: Node.js
- **Build tool**: `react-scripts` via Create React App

## Key Libraries

- **@testing-library/react**: Component and interaction testing for mini-game behavior
- **@testing-library/user-event**: User interaction tests when the game needs more realistic events
- **web-vitals**: Basic performance measurement support

## Development Standards

### Code Quality
- Prefer focused, readable component logic.
- Keep state transitions explicit and easy to test.
- Use CSS and classes for game feedback instead of hidden logic spread across the app.

### Testing
- Validate mini-game rules with Jest and React Testing Library.
- Test timing outcomes such as early release, late release, and success inside the safe window.

## Development Environment

### Common Commands
```bash
# Dev: npm start
# Build: npm run build
# Test: npm test
```

## Key Technical Decisions

- Keep the project as a lightweight web app so gameplay prototypes can be built quickly.
- Use component-level state for the game loop and retry logic rather than introducing extra infrastructure.
- Favor clear state transitions and explicit event boundaries for each mini-game.

---
_Document standards and patterns, not every dependency_
