import TipTap from '@/components/document-editor/TipTap'
import ExcalidrawCanvas from '@/components/excalidraw-canvas/ExcalidrawCanvas'
import ProtectedRoute from '@/components/protected-route/ProtectedRoute'
import AddBlog from '@/pages/AddBlog'
import GoaOnlineCallback from '@/pages/GoaOnlineCallback'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/sign-up/Signup'
import UdpLogin from '@/pages/udp-login/UdpLogin'
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
        path: '/auth/callback',
        element: <GoaOnlineCallback />
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
    path: '/test-login',
    element: <UdpLogin />
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
  }
])

