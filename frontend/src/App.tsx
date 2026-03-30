import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api";
import UpdateProfile from "./pages/UpdateProfile";
import AddBlog from "./pages/AddBlog";
import GoaOnlineCallback from "./pages/GoaOnlineCallback";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/signin",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/updateprofile",
      element: <UpdateProfile />,
    },
    {
      path:'/addblog',
      element:<AddBlog/>
    },
    // <Route path="/auth/callback" element={<GoaOnlineCallback />} />
    {
      path:'/auth/callback',
      element:<GoaOnlineCallback/>
    }
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
