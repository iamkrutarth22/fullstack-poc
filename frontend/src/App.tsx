import { RouterProvider } from 'react-router-dom'
import './App.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/api'
import { router } from './routes/router'

function App () {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App  