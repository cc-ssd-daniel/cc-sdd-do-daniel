# Project Structure

## Organization Philosophy

The codebase is intentionally simple and flat for rapid prototype work. The project keeps game logic, UI, and CSS close to the feature while preserving a clear separation between the app shell and the mini-game components.

## Directory Patterns

### Public Assets
**Location**: `vibe-code-do-daniel/public/`  
**Purpose**: Static files that are not processed by Webpack.  
**Example**: `index.html`, favicons.

### Source Code
**Location**: `vibe-code-do-daniel/src/`  
**Purpose**: App shell, game components, styles, tests, and shared configuration.  
**Example**: `App.js`, `minigames/reboot/RebootGame.js`.

## Naming Conventions

- **Files**: PascalCase for React component files (e.g., `RebootGame.js`), camelCase for utility modules and config files.
- **Styles**: Co-located CSS files matching the feature or component name.
- **Tests**: Co-located with `.test.js` suffix and focused on component behavior.
- **Mini-game folders**: Grouped under `src/minigames/<feature>/` to keep game logic isolated and reusable.

## Import Organization

```javascript
import './App.css';
import RebootGame from './minigames/reboot/RebootGame';
```

## Code Organization Principles

- Keep the app shell minimal and responsible only for stage composition.
- Keep each mini-game self-contained with its own logic, CSS, and config.
- Use small component boundaries to simplify testing and future reuse.
- Add shared logic only when the same rule is used across multiple game challenges.

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
