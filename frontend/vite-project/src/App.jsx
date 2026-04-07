import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/LoginPage"
import Register from "./pages/RegisterPage"
import Homepage from "./pages/Homepage"
import Dashboard from "./pages/Dashboard"
import CreateLink from "./pages/CreateLink"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"

function App() {
  const router = createBrowserRouter(
    [
      // {
      //   path: '/',
      //   element: <Home />
      // },
      {
        path: '/auth',
        element: <AuthLayout title="" description=""/>,
        children: [
          {
            path: 'login',
            element: <Login />
          },
          {
            path: 'register',
            element: <Register />
          }
        ]
      },
      {
        path: '/',
        children:[
          {
            path: '',
            element: <Homepage />
          },
          {
            path: '/dashboard',
            element: <Dashboard />
          },
           {
            path: '/create',
            element: <CreateLink />
          },
           {
            path: '/profile',
            element: <Profile />
          }
        ]
      },
           {
        path: '*',
        element: <NotFound />
      }
    ]
  )
  
  return (
    <RouterProvider router={router} />
  )
}

export default App;