// import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Shop from './components/Shop';
import { PhaserGame } from './phaser/PhaserGame'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/register',
        element: <Register />
      }, {
        path: '/profile',
        element: <Profile />
      }, {
        path: '/shop',
        element: <Shop />
      }, {
        path: '/play',
        element: <PhaserGame />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
