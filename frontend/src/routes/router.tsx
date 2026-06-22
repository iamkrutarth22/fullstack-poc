import TipTap from '@/components/document-editor/TipTap'
import ExcalidrawCanvas from '@/components/excalidraw-canvas/ExcalidrawCanvas'
import ProtectedRoute from '@/components/protected-route/ProtectedRoute'
import AddBlog from '@/pages/AddBlog'
import Counter from '@/pages/Counter'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/sign-up/Signup'
import UpdateProfile from '@/pages/UpdateProfile'
import VerifyOTP from '@/pages/verify-otp/VerifyOTP'
import Workspace from '@/pages/workspace/Workspace'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
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
        path: '/workspace',
        element: <Workspace />
      },
      {
        path: '/doc',
        element: <TipTap/>
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
  },
  {
    path: '/draw',
    element: <ExcalidrawCanvas />
  },
  {
    path:'/counter',
    element: <Counter />
  }
])

