import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClientProvider } from './providers/QueryClientProvider'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider>
    <App />
  </QueryClientProvider>
)
