import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../components/dashboard.js.js'
import NotFound from '../components/notFound'
import Login from '../components/login'
import SignUp from '../components/signUp.js'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },

  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default function Routes() {
  return <RouterProvider router={router} />
}
