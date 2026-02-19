import './App.css'
import Dashboard from '@/pages/Dashboard'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Dashboard />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
