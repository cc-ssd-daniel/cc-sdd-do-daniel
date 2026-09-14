# Project Structure

## Organization Philosophy

Standard Create React App flat structure, separating public assets from source code.

## Directory Patterns

### Public Assets
**Location**: `vibe-code-do-daniel/public/`  
**Purpose**: Static files that are not processed by Webpack.  
**Example**: `index.html`, favicons.

### Source Code
**Location**: `vibe-code-do-daniel/src/`  
**Purpose**: All application source code, components, CSS, and tests.  
**Example**: `App.js`, `index.js`.

## Naming Conventions

- **Files**: PascalCase for React components (e.g., `App.js`), camelCase or lowercase for utilities and configurations.
- **Styles**: Co-located CSS files with matching component names (e.g., `App.css` for `App.js`).
- **Tests**: Co-located with `.test.js` suffix (e.g., `App.test.js`).

## Import Organization

```javascript
// Example import patterns
import React from 'react';
import './App.css';
import logo from './logo.svg';
```

## Code Organization Principles

- Keep components flat in `src` until complexity warrants nested directories.
- CSS and test files are kept adjacent to their respective components.

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
