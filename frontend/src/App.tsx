import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api";
import UpdateProfile from "./pages/UpdateProfile";
import AddBlog from "./pages/AddBlog";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
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
