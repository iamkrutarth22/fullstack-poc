import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/sign-up/Signup'
import Home from './pages/Home'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/api'
import UpdateProfile from './pages/UpdateProfile'
import AddBlog from './pages/AddBlog'
import GoaOnlineCallback from './pages/GoaOnlineCallback'
import VerifyOTP from './pages/verify-otp/VerifyOTP'
import Workspace from './pages/workspace/Workspace'
import ProtectedRoute from './components/protected-route/ProtectedRoute'

function App () {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/updateprofile',
          element: <UpdateProfile />
        },
        {
          path: '/addblog',
          element: <AddBlog />
        },
        {
          path: '/auth/callback',
          element: <GoaOnlineCallback />
        },

        {
          path: '/workspace',
          element: <Workspace />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/verify-otp',
      element: <VerifyOTP />
    }
  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  )
}

export default App
