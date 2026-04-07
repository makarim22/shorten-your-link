import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/LoginPage"
import Register from "./pages/RegisterPage"
import Homepage from "./pages/Homepage"
// import Home from "./pages/Home/Home"

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
          }
        ]
      }
    ]
  )
  
  return (
    <RouterProvider router={router} />
  )
}

export default App;