# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build production version (runs TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

## Architecture

This is a React + TypeScript + Vite application that demonstrates spreadsheet functionality using Handsontable and Jotai for state management.

### Key Dependencies
- **Handsontable**: Enterprise-grade data grid component (`@handsontable/react-wrapper`, `handsontable`)
- **Jotai**: Atomic state management library for React
- **React 19**: Latest React version with modern patterns

### State Management
The application uses Jotai atoms for state management:
- `RowsAtom` in `src/atoms.ts` manages spreadsheet row data
- Defines `Row` interface for structured data with name, attendees, startTime, endTime
- Uses Handsontable's `RowObject[]` type for compatibility

### Component Structure
- `src/main.tsx`: Entry point with Handsontable CSS imports and React root setup
- `src/App.tsx`: Main component containing HotTable configuration
  - Uses non-commercial license key
  - Configured with dark theme (`ht-theme-main-dark-auto`)
  - Connected to Jotai state via `useAtom(RowsAtom)`

### TypeScript Configuration
Uses project references with separate configs:
- `tsconfig.app.json`: Application code configuration
- `tsconfig.node.json`: Node.js/build tooling configuration
- `tsconfig.json`: Root configuration that references both