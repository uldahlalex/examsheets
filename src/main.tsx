import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {DevTools} from "jotai-devtools";
import 'jotai-devtools/styles.css';
import Alternative from "./components/Alternative.tsx";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Alternative />
      <DevTools />
  </StrictMode>,
)
