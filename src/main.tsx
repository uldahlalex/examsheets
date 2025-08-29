import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import ReactSpreadsheetDemo from "./components/ReactSpreadsheetDemo.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactSpreadsheetDemo />
  </StrictMode>,
)
