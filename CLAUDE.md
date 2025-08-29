# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build production version (runs TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on the codebase

## Architecture

This is a React + TypeScript + Vite application that demonstrates spreadsheet functionality using react-spreadsheet and Jotai for state management.

### Key Dependencies
- **react-spreadsheet**: Lightweight spreadsheet component for React
- **Handsontable**: Also included but not currently used in main component
- **Jotai**: Atomic state management library for React
- **React 19**: Latest React version with modern patterns

### State Management
The application uses Jotai atoms for state management:
- `ExamsAtom` in `src/state/atoms.ts` manages exam data using `atomWithStorage`
- Defines `Row` interface in `src/types/row.ts` for structured data with examName, attendees, startTime, endTime
- Uses localStorage persistence via Jotai's `atomWithStorage`

### Component Structure
- `src/main.tsx`: Entry point with Handsontable CSS imports and React root setup
- `src/components/ReactSpreadsheetDemo.tsx`: Main component using react-spreadsheet
  - Connected to Jotai state via `useAtom(ExamsAtom)`
  - Handles data conversion between Row objects and spreadsheet matrix format
  - Auto-adds empty rows when data is entered in the last row

### Data Flow
- `convertToSpreadsheetData()`: Converts Row[] to CellData matrix format
- `convertFromSpreadsheetData()`: Converts CellData matrix back to Row[]
- Headers defined in `src/constants/Headers.tsx` as read-only cells
- Invalid time ranges (startTime > endTime) are highlighted with CSS classes

### TypeScript Configuration
Uses project references with separate configs:
- `tsconfig.app.json`: Application code configuration with strict typing
- `tsconfig.node.json`: Node.js/build tooling configuration
- `tsconfig.json`: Root configuration that references both